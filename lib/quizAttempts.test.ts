import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  hasExpired,
  isAttemptId,
  quizAnswerSchema,
  secondsLeft,
} from "./quizAttempts";
import { isQuizInProgress } from "./quizRoutes";

const validAnswer = {
  question: "What is 2 + 2?",
  options: ["3", "4", "5"],
  correctIndex: 1,
  selectedIndex: null,
};

describe("quizAnswerSchema", () => {
  it("accepts a well-formed answer", () => {
    expect(quizAnswerSchema.safeParse(validAnswer).success).toBe(true);
  });

  it("rejects a correct index outside the options", () => {
    const result = quizAnswerSchema.safeParse({ ...validAnswer, correctIndex: 3 });
    expect(result.success).toBe(false);
  });

  it("rejects a selected index outside the options", () => {
    const result = quizAnswerSchema.safeParse({ ...validAnswer, selectedIndex: 5 });
    expect(result.success).toBe(false);
  });

  it("rejects a question with fewer than two options", () => {
    const result = quizAnswerSchema.safeParse({ ...validAnswer, options: ["4"], correctIndex: 0 });
    expect(result.success).toBe(false);
  });
});

describe("isAttemptId", () => {
  it("accepts cuid-style ids and rejects anything else", () => {
    expect(isAttemptId("c05a37e367baa237f41249bf6")).toBe(true);
    expect(isAttemptId("12")).toBe(false);
    expect(isAttemptId("../settings")).toBe(false);
  });
});

describe("secondsLeft", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null when the quiz has no time limit", () => {
    expect(secondsLeft({ expiresAt: null })).toBeNull();
  });

  it("counts down to the deadline and stops at zero", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:01:30Z"));

    expect(secondsLeft({ expiresAt: new Date("2026-01-01T00:02:00Z") })).toBe(30);
    expect(secondsLeft({ expiresAt: new Date("2026-01-01T00:01:00Z") })).toBe(0);
  });
});

describe("hasExpired", () => {
  const deadline = new Date("2026-01-01T00:02:00Z");
  const at = (time: string) => new Date(time).getTime();

  it("allows a short grace period after the deadline", () => {
    const attempt = { status: "IN_PROGRESS", expiresAt: deadline };
    expect(hasExpired(attempt, at("2026-01-01T00:02:03Z"))).toBe(false);
    expect(hasExpired(attempt, at("2026-01-01T00:02:10Z"))).toBe(true);
  });

  it("never expires untimed or finished attempts", () => {
    const later = at("2026-01-02T00:00:00Z");
    expect(hasExpired({ status: "IN_PROGRESS", expiresAt: null }, later)).toBe(false);
    expect(hasExpired({ status: "SUBMITTED", expiresAt: deadline }, later)).toBe(false);
  });
});

describe("isQuizInProgress", () => {
  it("matches the play page but not score or review", () => {
    expect(isQuizInProgress("/quiz/c05a37e367baa237f41249bf6")).toBe(true);
    expect(isQuizInProgress("/quiz/c05a37e367baa237f41249bf6/score")).toBe(false);
    expect(isQuizInProgress("/quiz/c05a37e367baa237f41249bf6/review")).toBe(false);
  });
});
