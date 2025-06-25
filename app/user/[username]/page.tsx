"use client";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/app/store/store";
import { useEffect, useState } from "react";

interface UserType {
  name: string;
  username: string;
  gitHubUsername: string;
  profilePic: string;
  description: string;
  role: string;
  quizAttended: number;
  createdAt: Date;
}

const Profile = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const [user, setUser] = useState({});
  const { username } = useParams();

  useEffect(() => {
    (async function fetchUser() {
      const res = await fetch(`/api/user/${username}`);
      if (!res.ok) console.log(res);
      const data = await res.json();
      setUser(data);
    })();
  }, [username]);

  const typedUser = user as UserType | undefined;
  const displayName =
    typedUser?.name ||
    typedUser?.username ||
    typedUser?.gitHubUsername ||
    "User";
  const displayHandle = typedUser?.username || typedUser?.gitHubUsername || "";

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center items-start font-sans ${
        lightMode
          ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
          : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-2xl p-8 ${
          lightMode
            ? "bg-white/95 border border-slate-200 shadow-xl shadow-black/5"
            : "bg-slate-900/95 border border-slate-600 shadow-xl shadow-black/30"
        }`}
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          {/* Profile Picture (Kept as in original) */}
          <div
            className={`w-32 h-32 rounded-full border-4 ${
              lightMode ? "border-white" : "border-slate-800"
            } shadow-lg flex-shrink-0 overflow-hidden`}
          >
            {typedUser?.profilePic ? (
              <img
                src={typedUser.profilePic}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  lightMode ? "bg-gray-100" : "bg-slate-700"
                }`}
              >
                <span
                  className={`text-4xl font-bold ${
                    lightMode ? "text-emerald-600" : "text-emerald-400"
                  }`}
                >
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    lightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  {displayName}
                </h1>
                {displayHandle && (
                  <p
                    className={`text-lg ${
                      lightMode ? "text-emerald-600" : "text-emerald-400"
                    }`}
                  >
                    @{displayHandle}
                  </p>
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  typedUser?.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : lightMode
                    ? "bg-blue-100 text-blue-800"
                    : "bg-blue-900/50 text-blue-300"
                }`}
              >
                {typedUser?.role?.toUpperCase() || "USER"}
              </div>
            </div>

            {/* Description */}
            <div
              className={`p-4 rounded-lg ${
                lightMode ? "bg-gray-50" : "bg-slate-800/50"
              }`}
            >
              <p className={`${lightMode ? "text-gray-600" : "text-gray-400"}`}>
                {typedUser?.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Stats */}
          <div
            className={`p-6 rounded-xl ${
              lightMode ? "bg-gray-50" : "bg-slate-800/50"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                lightMode ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Quiz Activity
            </h3>
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  lightMode ? "bg-emerald-100" : "bg-emerald-900/50"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    lightMode ? "text-emerald-600" : "text-emerald-400"
                  }`}
                >
                  {typedUser?.quizAttended || 0}
                </span>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    lightMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Quizzes Completed
                </p>
                <p
                  className={`text-lg ${
                    lightMode ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {typedUser?.quizAttended || 0} total attempts
                </p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div
            className={`p-6 rounded-xl ${
              lightMode ? "bg-gray-50" : "bg-slate-800/50"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                lightMode ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Membership
            </h3>
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  lightMode ? "bg-blue-100" : "bg-blue-900/50"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={lightMode ? "#3b82f6" : "#93c5fd"}
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    lightMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Member Since
                </p>
                <p
                  className={`text-lg ${
                    lightMode ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {new Date(typedUser?.createdAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
