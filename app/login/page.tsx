"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../component/AuthLayout";
import FormField from "../component/FormField";
import { DEMO_PASSWORD, DEMO_USERNAME } from "@/lib/demo";

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
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  async function signInAs(name: string, secret: string) {
    setError("");
    setIsSigningIn(true);

    const result = await signIn("credentials", {
      username: name,
      password: secret,
      callbackUrl: `/user/${name}`,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password");
      setIsSigningIn(false);
    } else {
      router.push(`/user/${name}`);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    signInAs(username.trim(), password.trim());
  }

  return (
    <AuthLayout
      heroTitle="Welcome Back to QuizMania"
      heroText="Pick up where you left off and keep improving your score"
      features={features}
      title="Welcome Back"
      subtitle="Sign in to continue your quiz journey"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <FormField
          id="username"
          label="Username"
          type="text"
          required
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
          <button
            type="submit"
            className="btn-primary disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
            disabled={isSigningIn}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => signInAs(DEMO_USERNAME, DEMO_PASSWORD)}
            disabled={isSigningIn}
            className="mt-3 w-full px-6 py-3 rounded-2xl border-2 border-dashed font-semibold text-base cursor-pointer transition-colors duration-200 border-emerald-500 text-emerald-600 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
          >
            Sign in with test account
          </button>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Try QuizMania without signing up. The test account&apos;s profile
            can&apos;t be edited.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
