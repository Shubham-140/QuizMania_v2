import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession, updateUser, revalidateTag } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  updateUser: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("next/cache", () => ({ revalidateTag, unstable_cache: vi.fn() }));
vi.mock("@/lib/authOptions", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { update: updateUser } } }));
vi.mock("@/lib/quizAttempts", () => ({ finishExpiredAttempts: vi.fn() }));

import { updateProfile, type ProfileFormState } from "./actions";

const USER_ID = "cuser00000000000000000001";

const initialState: ProfileFormState = {
  status: "idle",
  message: "",
  values: { name: "", age: "", description: "" },
};

const submit = (fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  return updateProfile(initialState, formData);
};

describe("updateProfile server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSession.mockResolvedValue({ user: { id: USER_ID } });
    updateUser.mockResolvedValue({
      username: "quiz-fan",
      name: "Quiz Fan",
      age: null,
      description: null,
    });
  });

  it("refuses to save without a signed-in user", async () => {
    getServerSession.mockResolvedValue(null);

    const state = await submit({ name: "Quiz Fan", age: "", description: "" });

    expect(state.status).toBe("error");
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("returns the validation message and keeps what the user typed", async () => {
    const fields = { name: "Quiz Fan", age: "abc", description: "Hi" };

    const state = await submit(fields);

    expect(state).toEqual({
      status: "error",
      message: "Age must be a number",
      values: fields,
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("saves the signed-in user's profile with blank fields stored as empty", async () => {
    const state = await submit({ name: "  Quiz Fan ", age: "", description: "  " });

    expect(updateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: USER_ID },
        data: { name: "Quiz Fan", age: null, description: null },
      })
    );
    expect(state).toEqual({
      status: "success",
      message: "Profile saved",
      values: { name: "Quiz Fan", age: "", description: "" },
    });
  });

  it("refreshes only that user's cached public profile", async () => {
    await submit({ name: "Quiz Fan", age: "25", description: "" });

    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith("profile:quiz-fan");
  });
});
