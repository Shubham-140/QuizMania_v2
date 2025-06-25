import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, username, email, password } = body;

  try {
    const findUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    if (findUsername) {
      return NextResponse.json(
        {
          error: "Username already taken",
        },
        { status: 409 }
      );
    }
    const findEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (findEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
