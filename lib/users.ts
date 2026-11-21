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
      quizAttempts: {
        where: { completedAt: { not: null } },
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
      },
    },
  });

export type PublicUser = NonNullable<Awaited<ReturnType<typeof fetchPublicUser>>>;

const toCacheable = (user: PublicUser) => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
  quizAttempts: user.quizAttempts.map((attempt) => ({
    ...attempt,
    completedAt: attempt.completedAt?.toISOString() ?? null,
  })),
});

const fromCacheable = (user: ReturnType<typeof toCacheable>): PublicUser => ({
  ...user,
  createdAt: new Date(user.createdAt),
  quizAttempts: user.quizAttempts.map((attempt) => ({
    ...attempt,
    completedAt: attempt.completedAt ? new Date(attempt.completedAt) : null,
  })),
});

const getCachedPublicUser = (username: string) =>
  unstable_cache(
    async () => {
      const user = await fetchPublicUser(username);
      return user ? toCacheable(user) : null;
    },
    ["public-user", username],
    {
      tags: [profileTag(username)],
      revalidate: PROFILE_REVALIDATE_SECONDS,
    }
  )();

export const getPublicUser = cache(async (username: string) => {
  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!owner) return null;

  const finished = await finishExpiredAttempts(owner.id);
  if (finished > 0) return fetchPublicUser(username);

  const cached = await getCachedPublicUser(username);
  return cached ? fromCacheable(cached) : null;
});

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
