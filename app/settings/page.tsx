import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSettingsUser } from "@/lib/users";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Settings | QuizMania",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getSettingsUser(session.user.id);
  if (!user) {
    redirect("/login");
  }

  return <SettingsForm user={user} />;
}
