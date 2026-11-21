import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { signIn, push } = vi.hoisted(() => ({
  signIn: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next-auth/react", () => ({ signIn }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/app/component/AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Login from "./page";

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in with the test account in one click", async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ ok: true, error: null });
    render(<Login />);

    await user.click(
      screen.getByRole("button", { name: "Sign in with test account" })
    );

    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        username: "TestUser",
        password: "Test@123456",
        redirect: false,
      })
    );
    expect(push).toHaveBeenCalledWith("/user/TestUser");
  });

  it("shows an error and re-enables the buttons when sign-in fails", async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ ok: false, error: "CredentialsSignin" });
    render(<Login />);

    await user.type(screen.getByLabelText("Username"), "someone");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid username or password"
    );
    expect(push).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Sign in with test account" })
    ).toBeEnabled();
  });
});
