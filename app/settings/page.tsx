"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  setNumberOfQues,
  setTotalTime,
} from "../features/userChoices/userChoicesSlice";
import { useEffect, useState } from "react";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UserType {
  name: string;
  username: string;
  age: number;
  description: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      age?: number | null;
      quizAttended?: number;
      createdAt?: Date;
      profilePic?: string | null;
      role?: string;
      gitHubId?: string | null;
      gitHubUsername?: string | null;
      gitHubAvatarUrl?: string | null;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    age?: number | null;
    quizAttended?: number;
    createdAt?: Date;
    profilePic?: string | null;
    role?: string;
    gitHubId?: string | null;
    gitHubUsername?: string | null;
    gitHubAvatarUrl?: string | null;
  }
}

const Settings = () => {
  const { data: session } = useSession();
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const [user, setUser] = useState<UserType | null>(null);
  const totalTime = useSelector(
    (state: RootState) => state.userChoices.totalTime
  );
  const numberOfQuestions = useSelector(
    (state: RootState) => state.userChoices.numberOfQuestions
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [reduxHydrated, setReduxHydrated] = useState(false);

  // Local form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [quizAttended, setQuizAttended] = useState(0);

  // Fetch user from DB on mount
  useEffect(() => {
    if (!session?.user?.username) return;
    (async function fetchUser() {
      const res = await fetch(`/api/user/${session?.user?.username}`);
      const userData = await res.json();
      setName(userData.name);
      setAge(userData.age);
      setDescription(userData.description);
      setUsername(userData.username);
      setQuizAttended(userData.quizAttended);
    })();
  }, [session?.user?.username]);

  // Save changes to DB and re-fetch updated user
  async function handleSaveChanges() {
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log("Save failed", data);
        return;
      }

      // Re-fetch updated user
      const refreshed = await fetch(`/api/user/${username}`);
      const updatedUser = await refreshed.json();
      setUser(updatedUser);
      setName(updatedUser.name);
      setAge(updatedUser.age);
      setDescription(updatedUser.description);
      setUsername(updatedUser.username);

      console.log("Profile updated successfully", user);
    } catch (error) {
      console.log("Update error:", error);
    }
  }

  // Redux hydration
  useEffect(() => {
    if (!reduxHydrated) return;

    localStorage.setItem("totalTime", JSON.stringify(totalTime));
    localStorage.setItem(
      "numberOfQuestions",
      JSON.stringify(numberOfQuestions)
    );
    setReduxHydrated(true);
  }, [numberOfQuestions, totalTime, reduxHydrated]);

  useEffect(() => {
    const time = localStorage.getItem("totalTime");
    const questions = localStorage.getItem("numberOfQuestions");

    if (time && questions) {
      dispatch(setTotalTime(JSON.parse(time)));
      dispatch(setNumberOfQues(JSON.parse(questions)));
    }

    setReduxHydrated(true);
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen p-4 flex justify-center items-center font-inter ${
        lightMode
          ? "bg-[radial-gradient(circle_at_10%_20%,#f0fdf4_0%,#dcfce7_90%)]"
          : "bg-[radial-gradient(circle_at_10%_20%,#022c22_0%,#064e3b_90%)]"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-2xl p-8 relative overflow-hidden ${
          lightMode ? "bg-white/96" : "bg-slate-900/96"
        } ${
          lightMode ? "border border-slate-200" : "border border-slate-700"
        } ${
          lightMode
            ? "shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            : "shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        } backdrop-blur-md`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

        <h2
          className={`flex items-center gap-2 text-xl font-bold mb-6 ${
            lightMode ? "text-slate-900" : "text-slate-50"
          }`}
        >
          {/* ... svg icon ... */}
          User Settings
        </h2>

        {/* Profile Settings Section */}
        <div className="mb-8">
          <h3
            className={`text-lg font-semibold mb-4 pb-2 border-b ${
              lightMode
                ? "border-slate-200 text-slate-700"
                : "border-slate-700 text-slate-300"
            }`}
          >
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Username */}
              <div className="mb-6">
                <label
                  className={`block font-medium mb-2 text-sm ${
                    lightMode ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  readOnly
                  className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm cursor-not-allowed ${
                    lightMode
                      ? "border-slate-200 text-slate-900 bg-slate-100"
                      : "border-slate-600 text-slate-50 bg-slate-700"
                  }`}
                />
              </div>

              <div className="mb-6">
                <label
                  className={`block font-medium mb-2 text-sm ${
                    lightMode ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Quiz Attended
                </label>
                <input
                  type="number"
                  value={quizAttended}
                  readOnly
                  className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm cursor-not-allowed ${
                    lightMode
                      ? "border-slate-200 text-slate-900 bg-slate-100"
                      : "border-slate-600 text-slate-50 bg-slate-700"
                  }`}
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Name */}
              <div className="mb-6">
                <label
                  className={`block font-medium mb-2 text-sm ${
                    lightMode ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm ${
                    lightMode
                      ? "border-slate-200 text-slate-900"
                      : "border-slate-600 text-slate-50"
                  } ${lightMode ? "bg-slate-50" : "bg-slate-800"}`}
                  placeholder="Your full name"
                />
              </div>

              {/* Age */}
              <div className="mb-6">
                <label
                  className={`block font-medium mb-2 text-sm ${
                    lightMode ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm ${
                    lightMode
                      ? "border-slate-200 text-slate-900"
                      : "border-slate-600 text-slate-50"
                  } ${lightMode ? "bg-slate-50" : "bg-slate-800"}`}
                  placeholder="Enter your age"
                />
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="mb-6">
            <label
              className={`block font-medium mb-2 text-sm ${
                lightMode ? "text-slate-700" : "text-slate-300"
              }`}
            >
              About You
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm ${
                lightMode
                  ? "border-slate-200 text-slate-900"
                  : "border-slate-600 text-slate-50"
              } ${lightMode ? "bg-slate-50" : "bg-slate-800"}`}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Profile Save Button */}
          <div className="flex justify-end">
            <button
              className={`px-6 py-2 rounded-lg border-none text-white font-medium text-sm cursor-pointer transition-all
              bg-emerald-500 shadow-[0_2px_6px_${
                lightMode ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.2)"
              }]
              hover:-translate-y-0.5 hover:shadow-[0_4px_10px_${
                lightMode ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.3)"
              }]`}
              onClick={handleSaveChanges}
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* Quiz Settings Section */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 pb-2 border-b ${
              lightMode
                ? "border-slate-200 text-slate-700"
                : "border-slate-700 text-slate-300"
            }`}
          >
            Quiz Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number of Questions */}
            <div className="mb-6">
              <label
                className={`block font-medium mb-2 text-sm ${
                  lightMode ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Number of Questions
              </label>
              <select
                className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm cursor-pointer appearance-none ${
                  lightMode
                    ? "border-slate-200 text-slate-900"
                    : "border-slate-600 text-slate-50"
                } ${lightMode ? "bg-slate-50" : "bg-slate-800"}
              bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                lightMode ? "%231a1a1a" : "%23f8fafc"
              }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")]
              bg-no-repeat bg-[right_0.5rem_center] bg-[length:0.75rem] pr-8`}
                onChange={(e) => dispatch(setNumberOfQues(e.target.value))}
                value={numberOfQuestions}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            {/* Time Limit */}
            <div className="mb-6">
              <label
                className={`block font-medium mb-2 text-sm ${
                  lightMode ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Time Limit
              </label>
              <select
                className={`w-full bg-slate-50 border rounded-lg py-2 px-3 text-sm cursor-pointer appearance-none ${
                  lightMode
                    ? "border-slate-200 text-slate-900"
                    : "border-slate-600 text-slate-50"
                } ${lightMode ? "bg-slate-50" : "bg-slate-800"}
              bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                lightMode ? "%231a1a1a" : "%23f8fafc"
              }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")]
              bg-no-repeat bg-[right_0.5rem_center] bg-[length:0.75rem] pr-8`}
                onChange={(e) => dispatch(setTotalTime(e.target.value))}
                value={totalTime}
              >
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="180">3 minutes</option>
                <option value="300">5 minutes</option>
                <option value="999999">No limit</option>
              </select>
            </div>
          </div>
        </div>
        <div className="float-right mt-3">
          <button
            onClick={() => router.push("/")}
            className={`px-6 py-2 rounded-lg border ${
              lightMode
                ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            } font-medium text-sm cursor-pointer transition-all`}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
