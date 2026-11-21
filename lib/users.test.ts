import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, finishExpiredAttempts, unstableCache } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  finishExpiredAttempts: vi.fn(),
  unstableCache: vi.fn(),
}));

vi.mock("next/cache", () => ({ unstable_cache: unstableCache }));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique } } }));
vi.mock("@/lib/quizAttempts", () => ({ finishExpiredAttempts }));

import { getPublicUser, PROFILE_REVALIDATE_SECONDS } from "./users";

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
  quizAttempts: [
    {
      id: "cattempt00000000000000001",
      category: "science",
      difficulty: "easy",
      score: 7,
      totalQuestions: 10,
      timeTaken: 95,
      completedAt: new Date("2026-02-01T10:00:00Z"),
    },
  ],
};

describe("getPublicUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unstableCache.mockImplementation(
      (load: () => Promise<unknown>) => async () =>
        JSON.parse(JSON.stringify(await load()))
    );
    finishExpiredAttempts.mockResolvedValue(0);
    findUnique.mockImplementation(({ select }: { select: object }) =>
      Promise.resolve("id" in select ? { id: "cuser00000000000000000001" } : profileRow)
    );
  });

  it("caches the profile under the user's tag with a time-based fallback", async () => {
    await getPublicUser("quiz-fan");

    expect(unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["public-user", "quiz-fan"],
      { tags: ["profile:quiz-fan"], revalidate: PROFILE_REVALIDATE_SECONDS }
    );
  });

  it("returns real dates even though the cache stores JSON", async () => {
    const user = await getPublicUser("quiz-fan");

    expect(user?.createdAt).toBeInstanceOf(Date);
    expect(user?.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(user?.quizAttempts[0].completedAt).toBeInstanceOf(Date);
  });

  it("skips the cache right after an expired quiz was finished", async () => {
    finishExpiredAttempts.mockResolvedValue(1);

    const user = await getPublicUser("quiz-fan");

    expect(unstableCache).not.toHaveBeenCalled();
    expect(user).toEqual(profileRow);
  });

  it("returns null for unknown users without caching anything", async () => {
    findUnique.mockResolvedValue(null);

    expect(await getPublicUser("nobody")).toBeNull();
    expect(unstableCache).not.toHaveBeenCalled();
  });
});
