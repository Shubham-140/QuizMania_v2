import Image from "next/image";
import type { ReactNode } from "react";
import type { PublicUser } from "@/lib/users";

const panel = "p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50";
const panelTitle =
  "text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300";
const mutedText = "text-gray-500 dark:text-gray-400";
const accentText = "text-emerald-600 dark:text-emerald-400";

function StatCard({
  title,
  iconClassName,
  icon,
  label,
  value,
}: {
  title: string;
  iconClassName: string;
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={panel}>
      <h3 className={panelTitle}>{title}</h3>
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center ${iconClassName}`}
        >
          {icon}
        </div>
        <div>
          <p className={`text-sm ${mutedText}`}>{label}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfileView({
  user,
  recentQuizzes,
}: {
  user: PublicUser;
  recentQuizzes: ReactNode;
}) {
  const displayName =
    user.name || user.username || user.gitHubUsername || "User";
  const displayHandle = user.username || user.gitHubUsername || "";
  const avatarUrl = user.profilePic || user.gitHubAvatarUrl;

  return (
    <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-start">
      <div className="card w-full max-w-4xl rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg flex-shrink-0 overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={128}
                height={128}
                priority
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-700">
                <span className={`text-4xl font-bold ${accentText}`}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h1>
                {displayHandle && (
                  <p className={`text-lg ${accentText}`}>@{displayHandle}</p>
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                }`}
              >
                {user.role?.toUpperCase() || "USER"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
              <p className="text-gray-600 dark:text-gray-400">
                {user.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Quiz Activity"
            iconClassName="bg-emerald-100 dark:bg-emerald-900/50"
            icon={
              <span className={`text-2xl font-bold ${accentText}`}>
                {user.quizAttended || 0}
              </span>
            }
            label="Quizzes Completed"
            value={`${user.quizAttended || 0} total attempts`}
          />
          <StatCard
            title="Membership"
            iconClassName="bg-blue-100 dark:bg-blue-900/50"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                className="stroke-[#3b82f6] dark:stroke-[#93c5fd]"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            }
            label="Member Since"
            value={user.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              timeZone: "UTC",
            })}
          />
        </div>

        <div className={`mt-6 ${panel}`}>
          <h3 className={panelTitle}>Recent Quizzes</h3>
          {recentQuizzes}
        </div>
      </div>
    </div>
  );
}
