import { describe, expect, it } from "vitest";
import { scoreAttempt } from "./quizScoring";
import type { QuizAnswer } from "./quizAttempts";

const question = (correctIndex: number): QuizAnswer => ({
  question: `Question with answer ${correctIndex}`,
  options: ["A", "B", "C", "D"],
  correctIndex,
  selectedIndex: null,
});

const answers = [question(0), question(1), question(2)];

describe("scoreAttempt", () => {
  it("counts only the correct picks", () => {
    const result = scoreAttempt(answers, [0, 3, 2], 30, 120);

    expect(result.score).toBe(2);
    expect(result.answers.map((answer) => answer.selectedIndex)).toEqual([
      0, 3, 2,
    ]);
  });

  it("treats unanswered questions as wrong", () => {
    const result = scoreAttempt(answers, [null, null, 2], 30, 120);

    expect(result.score).toBe(1);
    expect(result.answers[0].selectedIndex).toBeNull();
  });

  it("ignores picks that point outside the options", () => {
    const result = scoreAttempt(answers, [9, 1, 2], 30, 120);

    expect(result.answers[0].selectedIndex).toBeNull();
    expect(result.score).toBe(2);
  });

  it("caps the time taken at the time limit", () => {
    expect(scoreAttempt(answers, [0, 1, 2], 500, 120).timeTaken).toBe(120);
  });

  it("keeps the real time when there is no limit", () => {
    expect(scoreAttempt(answers, [0, 1, 2], 500, null).timeTaken).toBe(500);
  });

  it("never changes the questions or the correct answers", () => {
    const result = scoreAttempt(answers, [3, 3, 3], 30, 120);

    expect(result.answers.map(({ options, correctIndex }) => ({ options, correctIndex }))).toEqual(
      answers.map(({ options, correctIndex }) => ({ options, correctIndex }))
    );
  });
});
