import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession, findFirst, updateMany, transaction } =
  vi.hoisted(() => {
    const updateMany = vi.fn();
    const updateUser = vi.fn();
    return {
      getServerSession: vi.fn(),
      findFirst: vi.fn(),
      updateMany,
      updateUser,
      transaction: vi.fn(async (run: (tx: unknown) => unknown) =>
        run({
          quizAttempt: { updateMany },
          user: { update: updateUser },
        })
      ),
    };
  });

vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("@/lib/authOptions", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    quizAttempt: { findFirst, updateMany },
    $transaction: transaction,
  },
}));

import { PATCH } from "./route";

const USER_ID = "cuser00000000000000000001";
const ATTEMPT_ID = "cattempt00000000000000001";

const attempt = (overrides: Record<string, unknown> = {}) => ({
  id: ATTEMPT_ID,
  userId: USER_ID,
  category: "science",
  difficulty: "easy",
  status: "IN_PROGRESS",
  timeLimit: 120,
  expiresAt: new Date(Date.now() + 90_000),
  score: 0,
  totalQuestions: 2,
  timeTaken: 0,
  answers: [
    { question: "Q1", options: ["A", "B"], correctIndex: 0, selectedIndex: null },
    { question: "Q2", options: ["A", "B"], correctIndex: 1, selectedIndex: null },
  ],
  createdAt: new Date(Date.now() - 30_000),
  completedAt: null,
  ...overrides,
});

const save = (body: unknown) =>
  PATCH(
    new Request(`http://localhost/api/quiz-attempts/${ATTEMPT_ID}/answers`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: ATTEMPT_ID }) }
  );

describe("PATCH /api/quiz-attempts/[id]/answers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSession.mockResolvedValue({ user: { id: USER_ID } });
    findFirst.mockResolvedValue(attempt());
    updateMany.mockResolvedValue({ count: 1 });
  });

  it("returns 401 when the user is not signed in", async () => {
    getServerSession.mockResolvedValue(null);

    expect((await save({ selected: [0, null] })).status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("saves the picks, dropping any that point outside the options", async () => {
    const response = await save({ selected: [1, 7] });

    expect(response.status).toBe(200);
    const saved = updateMany.mock.calls[0][0];
    expect(saved.where).toEqual({
      id: ATTEMPT_ID,
      userId: USER_ID,
      status: "IN_PROGRESS",
    });
    expect(
      saved.data.answers.map((answer: { selectedIndex: number | null }) => answer.selectedIndex)
    ).toEqual([1, null]);
  });

  it("rejects saves for an attempt that is already finished", async () => {
    findFirst.mockResolvedValue(
      attempt({ status: "SUBMITTED", completedAt: new Date() })
    );

    expect((await save({ selected: [0, 1] })).status).toBe(409);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("rejects saves that arrive after the deadline and its grace period", async () => {
    const expiresAt = new Date(Date.now() - 60_000);
    findFirst
      .mockResolvedValueOnce(attempt({ expiresAt }))
      .mockResolvedValueOnce(
        attempt({ expiresAt, status: "EXPIRED", completedAt: expiresAt })
      );

    const response = await save({ selected: [0, 1] });

    expect(response.status).toBe(409);
    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(updateMany.mock.calls[0][0].data.status).toBe("EXPIRED");
  });

  it("returns 400 when the number of picks doesn't match the quiz", async () => {
    expect((await save({ selected: [0] })).status).toBe(400);
    expect(updateMany).not.toHaveBeenCalled();
  });
});
