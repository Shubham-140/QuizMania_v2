import { getPublicUser } from "@/lib/users";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
  try {
    const { username } = await context.params;
    const user = await getPublicUser(username);

    return user
      ? NextResponse.json(user)
      : NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
