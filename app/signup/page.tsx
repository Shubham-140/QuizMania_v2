"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session?.user, router, pathname]);

  const handleSignup = async () => {
    if (!name || !password || !username || !email || !confirmPassword) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }

    try {
      const response = await fetch("api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, username, email }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data?.error === "Username already taken") {
          console.log("username exists");
          return;
        }
        if (data?.error === "Email already exists") {
          console.log("email exists");
          return;
        }
        return;
      }

      await signIn("credentials", {
        username,
        password,
        callbackUrl: "/",
      });
    } catch {
      console.log("Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen flex font-sans ${
        lightMode
          ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
          : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      }`}
    >
      {/* Right side - Enhanced branded section (now on the left) */}
      <div
        className={`hidden md:flex md:w-2/5 items-center justify-center p-8 relative overflow-hidden ${
          lightMode
            ? "bg-gradient-to-br from-emerald-100 via-emerald-200 to-blue-200"
            : "bg-gradient-to-br from-emerald-800 via-emerald-700 to-blue-700"
        }`}
      >
        {/* Floating elements */}
        <div
          className={`absolute top-20 left-20 w-16 h-16 rounded-2xl rotate-45 animate-bounce delay-1000 ${
            lightMode ? "bg-emerald-200/50" : "bg-emerald-600/30"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-12 h-12 rounded-full animate-pulse delay-500 ${
            lightMode ? "bg-blue-200/50" : "bg-blue-600/30"
          }`}
        ></div>
        <div
          className={`absolute top-1/3 right-10 w-8 h-8 rounded-lg rotate-12 animate-bounce delay-700 ${
            lightMode ? "bg-emerald-300/50" : "bg-emerald-500/30"
          }`}
        ></div>

        {/* Main content */}
        <div className="text-center p-8 relative z-10">
          <h1
            className={`text-3xl md:text-4xl font-extrabold mb-4 ${
              lightMode ? "text-gray-900" : "text-white"
            }`}
          >
            Welcome to QuizMania
          </h1>
          <p
            className={`text-lg mb-8 max-w-md mx-auto leading-relaxed ${
              lightMode ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Test your knowledge and climb the leaderboards with our engaging
            quiz platform
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                lightMode
                  ? "bg-white/80 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                  : "bg-slate-900/80 border-slate-600 hover:shadow-lg hover:shadow-black/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2L2 7l10 5 10-5-10-5z"
                    />
                  </svg>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    lightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Diverse Categories
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                lightMode
                  ? "bg-white/80 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                  : "bg-slate-900/80 border-slate-600 hover:shadow-lg hover:shadow-black/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    lightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Time Challenges
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                lightMode
                  ? "bg-white/80 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                  : "bg-slate-900/80 border-slate-600 hover:shadow-lg hover:shadow-black/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M22 12h-4l-3 9L9 3l-3 9H2"
                    />
                  </svg>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    lightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Answer Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-8">
        <div
          className={`w-full max-w-lg rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border relative overflow-hidden ${
            lightMode
              ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
              : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
          }`}
        >
          {/* Top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Join QuizMania
            </h2>
            <p
              className={`text-sm md:text-base ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Create your account and start testing your knowledge
            </p>
          </div>

          {/* GitHub OAuth Button */}
          <div className="mb-6">
            <button
              onClick={() => signIn("github")}
              className={`w-full flex cursor-pointer justify-center items-center gap-3 py-3 px-4 border rounded-2xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                lightMode
                  ? "bg-white/95 border-slate-200 text-gray-700 hover:shadow-lg hover:shadow-black/5"
                  : "bg-slate-900/95 border-slate-600 text-white hover:shadow-lg hover:shadow-black/20"
              }`}
            >
              <div className="w-5 h-5 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  lightMode ? "border-slate-200" : "border-slate-600"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-3 text-sm ${
                  lightMode
                    ? "bg-white/95 text-gray-500"
                    : "bg-slate-900/95 text-gray-400"
                }`}
              >
                Or continue with credentials
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-semibold mb-2 ${
                  lightMode ? "text-gray-900" : "text-white"
                }`}
              >
                Full Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  lightMode
                    ? "bg-white/95 border-slate-200 text-gray-900 placeholder-gray-400"
                    : "bg-slate-900/95 border-slate-600 text-white placeholder-gray-400"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-semibold mb-2 ${
                  lightMode ? "text-gray-900" : "text-white"
                }`}
              >
                Email Address
              </label>
              <input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  lightMode
                    ? "bg-white/95 border-slate-200 text-gray-900 placeholder-gray-400"
                    : "bg-slate-900/95 border-slate-600 text-white placeholder-gray-400"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-semibold mb-2 ${
                  lightMode ? "text-gray-900" : "text-white"
                }`}
              >
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                type="text"
                placeholder="Enter your username"
                className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  lightMode
                    ? "bg-white/95 border-slate-200 text-gray-900 placeholder-gray-400"
                    : "bg-slate-900/95 border-slate-600 text-white placeholder-gray-400"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-semibold mb-2 ${
                    lightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    lightMode
                      ? "bg-white/95 border-slate-200 text-gray-900 placeholder-gray-400"
                      : "bg-slate-900/95 border-slate-600 text-white placeholder-gray-400"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="resetPassword"
                  className={`block text-sm font-semibold mb-2 ${
                    lightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Confirm Password
                </label>
                <input
                  id="resetPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="resetPassword"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    lightMode
                      ? "bg-white/95 border-slate-200 text-gray-900 placeholder-gray-400"
                      : "bg-slate-900/95 border-slate-600 text-white placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-center pt-2">
              <div className="text-sm">
                <Link
                  href="/login"
                  className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors duration-200"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSignup}
                className={`w-full px-6 py-3 rounded-2xl border-none bg-emerald-500 text-white font-semibold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                  lightMode
                    ? "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    : "shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
