import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface UserType {
  name: string;
  age: number | null;
  description: string;
  profilePic: string;
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, age, description, profilePic } = body;

    // Add validation
    if (!name && !age && !description && !profilePic) {
      return NextResponse.json(
        { error: "At least one field must be provided" },
        { status: 400 }
      );
    }

    // Use Partial<UserType> for partial updates
    const updateData: Partial<UserType> = {};
    if (name) updateData.name = name;
    if (age !== undefined) updateData.age = parseInt(age);
    if (description) updateData.description = description;
    if (profilePic) updateData.profilePic = profilePic;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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
