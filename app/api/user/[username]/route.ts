import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
  try {
    const { username } = await context.params; // Await the params Promise

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        username: true,
        gitHubUsername: true,
        profilePic: true,
        description: true,
        role: true,
        quizAttended: true,
        createdAt: true,
        age: true,
      },
    });

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
