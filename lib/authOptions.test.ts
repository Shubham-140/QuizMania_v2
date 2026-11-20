import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findFirst } },
}));

import { authOptions } from "./authOptions";

type JwtArgs = Parameters<NonNullable<typeof authOptions.callbacks>["jwt"] & {}>[0];
type SessionArgs = Parameters<
  NonNullable<typeof authOptions.callbacks>["session"] & {}
>[0];

const runJwt = (token: Record<string, unknown>) =>
  authOptions.callbacks!.jwt!({ token } as unknown as JwtArgs);

const runSession = (token: Record<string, unknown>) =>
  authOptions.callbacks!.session!({
    session: { user: {}, expires: "" },
    token,
  } as unknown as SessionArgs);

describe("auth callbacks with sessions from before the cuid migration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("swaps an old numeric id for the user's current cuid", async () => {
    findFirst.mockResolvedValue({ id: "cnewuserid00000000000001" });

    const token = await runJwt({ id: 3, username: "quiz-fan" });

    expect(token.id).toBe("cnewuserid00000000000001");
    expect(findFirst).toHaveBeenCalledWith({
      where: { OR: [{ username: "quiz-fan" }] },
      select: { id: true },
    });
  });

  it("drops the id when the old session matches no user", async () => {
    findFirst.mockResolvedValue(null);

    const token = await runJwt({ id: 3, username: "deleted-user" });

    expect(token).not.toHaveProperty("id");
  });

  it("leaves tokens that already have a cuid untouched", async () => {
    const token = await runJwt({ id: "cnewuserid00000000000001" });

    expect(token.id).toBe("cnewuserid00000000000001");
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("never exposes a non-string id on the session", async () => {
    const session = (await runSession({ id: 3 })) as { user: { id: string } };

    expect(session.user.id).toBe("");
  });
});
