import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAllowedImageUrl } from "@/lib/images";

const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name can't be empty")
      .max(50, "Name can be at most 50 characters"),
    age: z
      .number("Age must be a number")
      .int("Age must be a whole number")
      .min(0, "Age can't be negative")
      .max(120, "Age can be at most 120")
      .nullable()
      .transform((age) => age || null),
    description: z
      .string()
      .trim()
      .max(200, "Description can be at most 200 characters")
      .transform((description) => description || null),
    profilePic: z
      .url("Profile picture must be a valid URL")
      .refine(isAllowedImageUrl, "Profile picture host is not allowed")
      .nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = updateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: result.data,
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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
