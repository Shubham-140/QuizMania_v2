import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublicUser } from "@/lib/users";
import { sharedOpenGraph, sharedTwitter } from "@/lib/site";
import ProfileView from "./ProfileView";
import RecentQuizzes, { RecentQuizzesSkeleton } from "./RecentQuizzes";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getPublicUser(username);

  if (!user) {
    return { title: "User not found | QuizMania", robots: { index: false } };
  }

  const title = `${user.name || username} | QuizMania`;
  const description = `${user.name || username} has completed ${user.quizAttended} ${
    user.quizAttended === 1 ? "quiz" : "quizzes"
  } on QuizMania.`;

  return {
    title,
    description,
    alternates: { canonical: `/user/${username}` },
    openGraph: {
      ...sharedOpenGraph,
      type: "profile",
      title,
      description,
      url: `/user/${username}`,
    },
    twitter: { ...sharedTwitter, title, description },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await getPublicUser(username);

  if (!user) {
    notFound();
  }

  return (
    <ProfileView
      user={user}
      recentQuizzes={
        <Suspense fallback={<RecentQuizzesSkeleton />}>
          <RecentQuizzes username={username} />
        </Suspense>
      }
    />
  );
}
