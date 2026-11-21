import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession, findFirst, updateMany, updateUser, transaction } =
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
    quizAttempt: { findFirst },
    $transaction: transaction,
  },
}));

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }));
vi.mock("next/cache", () => ({ revalidateTag, unstable_cache: vi.fn() }));

import { POST } from "./route";

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

const submit = (body: unknown) =>
  POST(
    new Request(`http://localhost/api/quiz-attempts/${ATTEMPT_ID}/submit`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: ATTEMPT_ID }) }
  );

describe("POST /api/quiz-attempts/[id]/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSession.mockResolvedValue({
      user: { id: USER_ID, username: "quiz-fan" },
    });
    findFirst.mockResolvedValue(attempt());
    updateMany.mockResolvedValue({ count: 1 });
  });

  it("returns 401 when the user is not signed in", async () => {
    getServerSession.mockResolvedValue(null);

    const response = await submit({ selected: [0, 1] });

    expect(response.status).toBe(401);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("only looks up attempts owned by the user and returns 404 otherwise", async () => {
    findFirst.mockResolvedValue(null);

    const response = await submit({ selected: [0, 1] });

    expect(response.status).toBe(404);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: ATTEMPT_ID, userId: USER_ID } })
    );
  });

  it("returns 409 when the attempt is already submitted", async () => {
    findFirst.mockResolvedValue(
      attempt({ status: "SUBMITTED", completedAt: new Date() })
    );

    const response = await submit({ selected: [0, 1] });

    expect(response.status).toBe(409);
    expect(transaction).not.toHaveBeenCalled();
  });

  it("returns 400 when the number of answers doesn't match the quiz", async () => {
    const response = await submit({ selected: [0] });

    expect(response.status).toBe(400);
    expect(transaction).not.toHaveBeenCalled();
  });

  it("scores the picks on the server and saves the result", async () => {
    const response = await submit({ selected: [0, 0] });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: ATTEMPT_ID });

    const saved = updateMany.mock.calls[0][0];
    expect(saved.where).toEqual({
      id: ATTEMPT_ID,
      userId: USER_ID,
      status: "IN_PROGRESS",
    });
    expect(saved.data.status).toBe("SUBMITTED");
    expect(saved.data.score).toBe(1);
    expect(saved.data.timeTaken).toBeGreaterThanOrEqual(30);
    expect(saved.data.completedAt).toBeInstanceOf(Date);
    expect(updateUser).toHaveBeenCalledWith({
      where: { id: USER_ID },
      data: { quizAttended: { increment: 1 } },
    });
    expect(revalidateTag).toHaveBeenCalledWith("profile:quiz-fan");
  });

  it("returns 409 and doesn't count the quiz twice when a second submit races the first", async () => {
    updateMany.mockResolvedValue({ count: 0 });

    const response = await submit({ selected: [0, 1] });

    expect(response.status).toBe(409);
    expect(updateUser).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("finishes an attempt submitted long after its deadline using the saved picks", async () => {
    const expiresAt = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const expired = attempt({
      expiresAt,
      createdAt: new Date(expiresAt.getTime() - 120_000),
      answers: [
        { question: "Q1", options: ["A", "B"], correctIndex: 0, selectedIndex: 0 },
        { question: "Q2", options: ["A", "B"], correctIndex: 1, selectedIndex: null },
      ],
    });
    findFirst
      .mockResolvedValueOnce(expired)
      .mockResolvedValueOnce({ ...expired, status: "EXPIRED", completedAt: expiresAt });

    const response = await submit({ selected: [1, 1] });

    expect(response.status).toBe(409);
    const finished = updateMany.mock.calls[0][0];
    expect(finished.data).toMatchObject({
      status: "EXPIRED",
      score: 1,
      timeTaken: 120,
      completedAt: expiresAt,
    });
    expect(updateMany).toHaveBeenCalledTimes(1);
  });
});
