import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getActiveAttempt } from "@/lib/quizAttempts";
import HomePage from "./component/HomePage";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const attempt = session?.user?.id
    ? await getActiveAttempt(session.user.id)
    : null;

  return (
    <HomePage
      activeAttempt={
        attempt && {
          id: attempt.id,
          category: attempt.category,
          secondsLeft: attempt.secondsLeft,
        }
      }
    />
  );
}
