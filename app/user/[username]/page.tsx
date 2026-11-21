import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublicUser } from "@/lib/users";
import ProfileView from "./ProfileView";
import RecentQuizzes, { RecentQuizzesSkeleton } from "./RecentQuizzes";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getPublicUser(username);

  return {
    title: user ? `${user.name || username} | QuizMania` : "User not found | QuizMania",
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
