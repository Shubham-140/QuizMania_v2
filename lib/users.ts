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
      description: true,
      role: true,
      quizAttended: true,
      createdAt: true,
      age: true,
      quizResults: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          category: true,
          difficulty: true,
          score: true,
          totalQuestions: true,
          timeTaken: true,
          createdAt: true,
        },
      },
    },
  });
});

export async function getSettingsUser(id: number) {
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
