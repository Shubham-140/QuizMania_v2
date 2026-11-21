"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setNumberOfQues,
  setTotalTime,
} from "../features/userChoices/userChoicesSlice";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { updateProfile, type ProfileFormState } from "./actions";
import { RootState } from "@/app/store/store";
import type { SettingsUser } from "@/lib/users";

const sectionTitle =
  "text-lg font-semibold mb-4 pb-2 border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300";
const control =
  "w-full border rounded-lg py-2 px-3 text-sm border-slate-200 text-slate-900 dark:border-slate-600 dark:text-slate-50";
const readOnlyControl = `${control} cursor-not-allowed bg-slate-100 dark:bg-slate-700`;
const editableControl = `${control} bg-slate-50 dark:bg-slate-800`;
const selectControl = `${editableControl} pr-8 cursor-pointer select-arrow`;

const questionOptions = [5, 10, 15, 20];
const timeOptions = [
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 180, label: "3 minutes" },
  { value: 300, label: "5 minutes" },
  { value: 999999, label: "No limit" },
];

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block font-medium mb-2 text-sm text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SettingsForm({ user }: { user: SettingsUser }) {
  const totalTime = useSelector(
    (state: RootState) => state.userChoices.totalTime
  );
  const numberOfQuestions = useSelector(
    (state: RootState) => state.userChoices.numberOfQuestions
  );
  const dispatch = useDispatch();
  const [reduxHydrated, setReduxHydrated] = useState(false);

  const initialState: ProfileFormState = {
    status: "idle",
    message: "",
    values: {
      name: user.name ?? "",
      age: user.age ? String(user.age) : "",
      description: user.description ?? "",
    },
  };
  const [state, formAction, isSaving] = useActionState(
    updateProfile,
    initialState
  );
  const [showSaved, setShowSaved] = useState(false);
  const username = user.username ?? user.gitHubUsername ?? "";
  const quizAttended = user.quizAttended;

  useEffect(() => {
    if (state.status !== "success") return;
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [state]);

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
    <div className="page-bg-soft min-h-screen p-4 flex justify-center items-center">
      <div className="card-soft w-full max-w-4xl rounded-2xl p-8 relative overflow-hidden">
        <div className="accent-bar"></div>

        <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-slate-900 dark:text-slate-50">
          User Settings
        </h2>

        <form action={formAction} className="mb-8">
          <h3 className={sectionTitle}>Profile Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Field id="username" label="Username">
                <input
                  id="username"
                  type="text"
                  value={username}
                  readOnly
                  className={readOnlyControl}
                />
              </Field>

              <Field id="quizAttended" label="Quiz Attended">
                <input
                  id="quizAttended"
                  type="number"
                  value={quizAttended ?? 0}
                  readOnly
                  className={readOnlyControl}
                />
              </Field>
            </div>

            <div>
              <Field id="fullName" label="Full Name">
                <input
                  id="fullName"
                  name="name"
                  type="text"
                  defaultValue={state.values.name}
                  className={editableControl}
                  placeholder="Your full name"
                />
              </Field>

              <Field id="age" label="Age">
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={0}
                  max={120}
                  defaultValue={state.values.age}
                  className={editableControl}
                  placeholder="Enter your age"
                />
              </Field>
            </div>
          </div>

          <Field id="description" label="About You">
            <textarea
              id="description"
              name="description"
              defaultValue={state.values.description}
              className={editableControl}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </Field>

          <div className="flex items-center justify-end gap-4">
            {state.status === "error" && (
              <p role="alert" className="text-sm text-red-500">
                {state.message}
              </p>
            )}
            <p
              role="status"
              className="text-sm text-emerald-600 dark:text-emerald-400"
            >
              {showSaved ? state.message : ""}
            </p>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white font-medium text-sm cursor-pointer transition-all bg-emerald-500 hover:-translate-y-0.5 shadow-[0_2px_6px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_10px_rgba(16,185,129,0.4)] dark:shadow-[0_2px_6px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_4px_10px_rgba(16,185,129,0.3)] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        <div>
          <h3 className={sectionTitle}>Quiz Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field id="numberOfQuestions" label="Number of Questions">
              <select
                id="numberOfQuestions"
                className={selectControl}
                onChange={(e) => dispatch(setNumberOfQues(e.target.value))}
                value={numberOfQuestions}
              >
                {questionOptions.map((count) => (
                  <option key={count} value={count}>
                    {count} Questions
                  </option>
                ))}
              </select>
            </Field>

            <Field id="totalTime" label="Time Limit">
              <select
                id="totalTime"
                className={selectControl}
                onChange={(e) => dispatch(setTotalTime(e.target.value))}
                value={totalTime}
              >
                {timeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
        <div className="float-right mt-3">
          <Link
            href="/"
            className="inline-block text-center px-6 py-2 rounded-lg border font-medium text-sm transition-all border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
