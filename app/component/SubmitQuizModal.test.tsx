import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmitQuizModal } from "./SubmitQuizModal";

const renderModal = (onSubmit = vi.fn(() => new Promise<void>(() => {}))) => {
  const setSubmitOverlay = vi.fn();
  render(
    <SubmitQuizModal setSubmitOverlay={setSubmitOverlay} onSubmit={onSubmit} />
  );
  return { setSubmitOverlay, onSubmit };
};

describe("SubmitQuizModal", () => {
  it("is announced as a dialog with its title", () => {
    renderModal();

    expect(
      screen.getByRole("dialog", { name: "Submit Your Quiz?" })
    ).toBeInTheDocument();
  });

  it("moves focus into the dialog and keeps Tab inside it", async () => {
    const user = userEvent.setup();
    renderModal();

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const submit = screen.getByRole("button", { name: "Submit Quiz" });
    expect(cancel).toHaveFocus();

    await user.tab();
    expect(submit).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.tab({ shift: true });
    expect(submit).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const { setSubmitOverlay } = renderModal();

    await user.keyboard("{Escape}");

    expect(setSubmitOverlay).toHaveBeenCalledWith(false);
  });

  it("stays open on Escape while the quiz is being submitted", async () => {
    const user = userEvent.setup();
    const { setSubmitOverlay } = renderModal();

    await user.click(screen.getByRole("button", { name: "Submit Quiz" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Submitting..." })).toBeDisabled();
    expect(setSubmitOverlay).not.toHaveBeenCalled();
  });

  it("returns focus to where it was when it closes", () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();

    const { unmount } = render(
      <SubmitQuizModal setSubmitOverlay={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(opener).not.toHaveFocus();
    unmount();

    expect(opener).toHaveFocus();
    opener.remove();
  });
});
