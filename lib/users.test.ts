import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, findMany, finishExpiredAttempts, unstableCache } =
  vi.hoisted(() => ({
    findUnique: vi.fn(),
    findMany: vi.fn(),
    finishExpiredAttempts: vi.fn(),
    unstableCache: vi.fn(),
  }));

vi.mock("next/cache", () => ({ unstable_cache: unstableCache }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique }, quizAttempt: { findMany } },
}));
vi.mock("@/lib/quizAttempts", () => ({ finishExpiredAttempts }));

import {
  getPublicUser,
  getRecentAttempts,
  PROFILE_REVALIDATE_SECONDS,
} from "./users";

const USER_ID = "cuser00000000000000000001";

const profileRow = {
  name: "Quiz Fan",
  username: "quiz-fan",
  gitHubUsername: null,
  profilePic: null,
  gitHubAvatarUrl: null,
  description: null,
  role: "user",
  quizAttended: 3,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  age: null,
};

const attemptRows = [
  {
    id: "cattempt00000000000000001",
    category: "science",
    difficulty: "easy",
    score: 7,
    totalQuestions: 10,
    timeTaken: 95,
    completedAt: new Date("2026-02-01T10:00:00Z"),
  },
];

const cacheOptions = {
  tags: ["profile:quiz-fan"],
  revalidate: PROFILE_REVALIDATE_SECONDS,
};

describe("cached public profile data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unstableCache.mockImplementation(
      (load: () => Promise<unknown>) => async () =>
        JSON.parse(JSON.stringify(await load()))
    );
    finishExpiredAttempts.mockResolvedValue(0);
    findUnique.mockImplementation(({ select }: { select: object }) =>
      Promise.resolve("id" in select ? { id: USER_ID } : profileRow)
    );
    findMany.mockResolvedValue(attemptRows);
  });

  it("caches the profile and its recent quizzes under the same user tag", async () => {
    await getPublicUser("quiz-fan");
    await getRecentAttempts("quiz-fan");

    expect(unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["public-user", "quiz-fan"],
      cacheOptions
    );
    expect(unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["recent-attempts", USER_ID],
      cacheOptions
    );
  });

  it("returns real dates even though the cache stores JSON", async () => {
    const user = await getPublicUser("quiz-fan");
    const attempts = await getRecentAttempts("quiz-fan");

    expect(user?.createdAt).toBeInstanceOf(Date);
    expect(user?.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(attempts[0].completedAt).toBeInstanceOf(Date);
  });

  it("skips the cache right after an expired quiz was finished", async () => {
    finishExpiredAttempts.mockResolvedValue(1);

    expect(await getPublicUser("quiz-fan")).toEqual(profileRow);
    expect(await getRecentAttempts("quiz-fan")).toEqual(attemptRows);
    expect(unstableCache).not.toHaveBeenCalled();
  });

  it("returns nothing for unknown users without caching anything", async () => {
    findUnique.mockResolvedValue(null);

    expect(await getPublicUser("nobody")).toBeNull();
    expect(await getRecentAttempts("nobody")).toEqual([]);
    expect(unstableCache).not.toHaveBeenCalled();
  });
});
