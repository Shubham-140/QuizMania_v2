"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../component/AuthLayout";

const featureIcon = (path: string) => (
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
      d={path}
    />
  </svg>
);

const features = [
  {
    label: "Track Your Progress",
    icon: featureIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"),
  },
  {
    label: "View Your Stats",
    icon: featureIcon(
      "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    ),
  },
  {
    label: "Time Challenges",
    icon: featureIcon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"),
  },
];

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      username: username.trim(),
      password: password.trim(),
      callbackUrl: `/user/${username}`,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push(`/user/${username}`);
    }
  }

  return (
    <AuthLayout
      heroTitle="Welcome Back to QuizMania"
      heroText="Continue your journey and climb the leaderboards"
      features={features}
      title="Welcome Back"
      subtitle="Sign in to continue your quiz journey"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="field-label">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="field"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="field"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-center pt-2">
          <div className="text-sm">
            <Link
              href="/signup"
              className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors duration-200"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>

        <div className="pt-4">
          {error && (
            <p role="alert" className="mb-3 text-center text-sm text-red-500">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
