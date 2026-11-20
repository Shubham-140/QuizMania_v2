"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../component/AuthLayout";
import FormField from "../component/FormField";

const iconProps = {
  className: "w-4 h-4 text-white",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
};

const features = [
  {
    label: "Diverse Categories",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2L2 7l10 5 10-5-10-5z"
        />
      </svg>
    ),
  },
  {
    label: "Time Challenges",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Answer Review",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M22 12h-4l-3 9L9 3l-3 9H2"
        />
      </svg>
    ),
  },
];

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !password ||
      !trimmedUsername ||
      !trimmedEmail ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          password,
          username: trimmedUsername,
          email: trimmedEmail,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Signup failed. Please try again.");
        return;
      }

      const result = await signIn("credentials", {
        username: trimmedUsername,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Account created, but sign-in failed. Please log in with your credentials."
        );
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Welcome to QuizMania"
      heroText="Test your knowledge across ten categories and review every answer"
      features={features}
      title="Join QuizMania"
      subtitle="Create your account and start testing your knowledge"
    >
      <div className="space-y-4">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormField
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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

        {error && (
          <p className="text-sm font-medium text-red-500 text-center">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button
            type="button"
            onClick={handleSignup}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
