import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getPublicUser = cache(async (username: string) => {
  return prisma.user.findUnique({
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

export type PublicUser = NonNullable<Awaited<ReturnType<typeof getPublicUser>>>;
export type SettingsUser = NonNullable<
  Awaited<ReturnType<typeof getSettingsUser>>
>;
