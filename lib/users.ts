import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { finishExpiredAttempts } from "@/lib/quizAttempts";

export const PROFILE_REVALIDATE_SECONDS = 300;

export const profileTag = (username: string) => `profile:${username}`;

const fetchPublicUser = (username: string) =>
  prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      gitHubUsername: true,
      profilePic: true,
      gitHubAvatarUrl: true,
      description: true,
      role: true,
      quizAttended: true,
      createdAt: true,
      age: true,
    },
  });

const fetchRecentAttempts = (userId: string) =>
  prisma.quizAttempt.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    take: 5,
    select: {
      id: true,
      category: true,
      difficulty: true,
      score: true,
      totalQuestions: true,
      timeTaken: true,
      completedAt: true,
    },
  });

export type PublicUser = NonNullable<Awaited<ReturnType<typeof fetchPublicUser>>>;
export type RecentAttempt = Awaited<ReturnType<typeof fetchRecentAttempts>>[number];

const cacheOptions = (username: string) => ({
  tags: [profileTag(username)],
  revalidate: PROFILE_REVALIDATE_SECONDS,
});

const getCachedPublicUser = (username: string) =>
  unstable_cache(
    async () => {
      const user = await fetchPublicUser(username);
      return user ? { ...user, createdAt: user.createdAt.toISOString() } : null;
    },
    ["public-user", username],
    cacheOptions(username)
  )();

const getCachedRecentAttempts = (userId: string, username: string) =>
  unstable_cache(
    async () =>
      (await fetchRecentAttempts(userId)).map((attempt) => ({
        ...attempt,
        completedAt: attempt.completedAt?.toISOString() ?? null,
      })),
    ["recent-attempts", userId],
    cacheOptions(username)
  )();

const getProfileOwner = cache(async (username: string) => {
  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!owner) return null;

  const finished = await finishExpiredAttempts(owner.id);
  return { id: owner.id, justFinishedAttempts: finished > 0 };
});

export const getPublicUser = cache(
  async (username: string): Promise<PublicUser | null> => {
    const owner = await getProfileOwner(username);
    if (!owner) return null;
    if (owner.justFinishedAttempts) return fetchPublicUser(username);

    const cached = await getCachedPublicUser(username);
    return cached ? { ...cached, createdAt: new Date(cached.createdAt) } : null;
  }
);

export const getRecentAttempts = cache(
  async (username: string): Promise<RecentAttempt[]> => {
    const owner = await getProfileOwner(username);
    if (!owner) return [];
    if (owner.justFinishedAttempts) return fetchRecentAttempts(owner.id);

    const cached = await getCachedRecentAttempts(owner.id, username);
    return cached.map((attempt) => ({
      ...attempt,
      completedAt: attempt.completedAt ? new Date(attempt.completedAt) : null,
    }));
  }
);

export async function getSettingsUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      username: true,
      gitHubUsername: true,
      age: true,
      description: true,
      quizAttended: true,
    },
  });
}

export type SettingsUser = NonNullable<
  Awaited<ReturnType<typeof getSettingsUser>>
>;
