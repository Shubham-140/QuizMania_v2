import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import QuizPlayer from "./QuizPlayer";

const ATTEMPT_ID = "cattempt00000000000000001";
const questions = [
  { question: "Capital of France?", options: ["Berlin", "Paris"] },
  { question: "Largest planet?", options: ["Jupiter", "Mars"] },
];

const fetchMock = vi.fn();

const renderPlayer = (props: Partial<Parameters<typeof QuizPlayer>[0]> = {}) =>
  render(
    <QuizPlayer
      attemptId={ATTEMPT_ID}
      questions={questions}
      timeLimit={120}
      initialTimeLeft={120}
      {...props}
    />
  );

const sentSelection = () =>
  JSON.parse(fetchMock.mock.calls[0][1].body as string).selected;

describe("QuizPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: ATTEMPT_ID }),
    });
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
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/quiz-attempts/${ATTEMPT_ID}/submit`,
      expect.objectContaining({ method: "POST" })
    );
    expect(sentSelection()).toEqual([1, 0]);
  });

  it("shows a retry message instead of leaving when saving fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    const user = userEvent.setup();
    renderPlayer();

    await user.click(screen.getByRole("button", { name: /next/i }));
    await user.click(screen.getByRole("button", { name: "Submit Quiz" }));
    const submitButtons = screen.getAllByRole("button", { name: "Submit Quiz" });
    await user.click(submitButtons[submitButtons.length - 1]);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't save your result"
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("submits on its own when the time has run out", async () => {
    renderPlayer({ initialTimeLeft: 0 });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(sentSelection()).toEqual([null, null]);
  });

  it("hides the timer when the quiz has no time limit", () => {
    renderPlayer({ timeLimit: null, initialTimeLeft: null });

    expect(screen.queryByText(/^\d\d:\d\d$/)).not.toBeInTheDocument();
  });
});
