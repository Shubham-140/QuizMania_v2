import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import QuizPlayer from "./QuizPlayer";

const ATTEMPT_ID = "cattempt00000000000000001";
const SUBMIT_URL = `/api/quiz-attempts/${ATTEMPT_ID}/submit`;
const ANSWERS_URL = `/api/quiz-attempts/${ATTEMPT_ID}/answers`;
const questions = [
  { question: "Capital of France?", options: ["Berlin", "Paris"] },
  { question: "Largest planet?", options: ["Jupiter", "Mars"] },
];

const fetchMock = vi.fn();
const ok = { ok: true, status: 200, json: async () => ({ id: ATTEMPT_ID }) };

const renderPlayer = (props: Partial<Parameters<typeof QuizPlayer>[0]> = {}) =>
  render(
    <QuizPlayer
      attemptId={ATTEMPT_ID}
      questions={questions}
      initialSelected={[null, null]}
      secondsLeft={120}
      {...props}
    />
  );

const callsTo = (url: string) =>
  fetchMock.mock.calls.filter(([calledUrl]) => calledUrl === url);

const bodyOf = (call: unknown[]) =>
  JSON.parse((call[1] as { body: string }).body).selected;

const submitFromLastQuestion = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /next/i }));
  await user.click(screen.getByRole("button", { name: "Submit Quiz" }));
  const submitButtons = screen.getAllByRole("button", { name: "Submit Quiz" });
  await user.click(submitButtons[submitButtons.length - 1]);
};

describe("QuizPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue(ok);
  });

  it("walks through the questions, submits the picks and opens the score page", async () => {
    const user = userEvent.setup();
    renderPlayer();

    expect(screen.getByText("QUESTION 1 OF 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();

    await user.click(screen.getByText("Paris"));
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText("Largest planet?")).toBeInTheDocument();
    await user.click(screen.getByText("Jupiter"));
    await user.click(screen.getByRole("button", { name: "Submit Quiz" }));
    const submitButtons = screen.getAllByRole("button", { name: "Submit Quiz" });
    await user.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(`/quiz/${ATTEMPT_ID}/score`)
    );
    expect(bodyOf(callsTo(SUBMIT_URL)[0])).toEqual([1, 0]);
  });

  it("saves each pick to the server as soon as it is made", async () => {
    const user = userEvent.setup();
    renderPlayer();

    await user.click(screen.getByText("Paris"));

    await waitFor(() => expect(callsTo(ANSWERS_URL)).toHaveLength(1));
    expect(callsTo(ANSWERS_URL)[0][1]).toMatchObject({ method: "PATCH" });
    expect(bodyOf(callsTo(ANSWERS_URL)[0])).toEqual([1, null]);
  });

  it("sends only the latest picks when clicks happen during a save", async () => {
    let finishFirstSave: (value: typeof ok) => void = () => {};
    fetchMock.mockImplementationOnce(
      () => new Promise((resolve) => (finishFirstSave = resolve))
    );
    const user = userEvent.setup();
    renderPlayer();

    await user.click(screen.getByText("Paris"));
    await user.click(screen.getByText("Berlin"));
    await user.click(screen.getByText("Paris"));
    expect(callsTo(ANSWERS_URL)).toHaveLength(1);

    finishFirstSave(ok);

    await waitFor(() => expect(callsTo(ANSWERS_URL)).toHaveLength(2));
    expect(bodyOf(callsTo(ANSWERS_URL)[1])).toEqual([1, null]);
  });

  it("restores picks saved before a refresh", async () => {
    const user = userEvent.setup();
    renderPlayer({ initialSelected: [1, null] });

    await submitFromLastQuestion(user);

    await waitFor(() => expect(callsTo(SUBMIT_URL)).toHaveLength(1));
    expect(bodyOf(callsTo(SUBMIT_URL)[0])).toEqual([1, null]);
  });

  it("shows a retry message instead of leaving when saving fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    const user = userEvent.setup();
    renderPlayer();

    await submitFromLastQuestion(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't save your result"
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("submits on its own when the time has run out", async () => {
    renderPlayer({ secondsLeft: 0 });

    await waitFor(() => expect(callsTo(SUBMIT_URL)).toHaveLength(1));
    expect(bodyOf(callsTo(SUBMIT_URL)[0])).toEqual([null, null]);
  });

  it("hides the timer when the quiz has no time limit", () => {
    renderPlayer({ secondsLeft: null });

    expect(screen.queryByText(/^\d\d:\d\d$/)).not.toBeInTheDocument();
  });
});
