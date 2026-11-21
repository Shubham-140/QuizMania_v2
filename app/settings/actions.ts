"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { profileTag } from "@/lib/users";

export type ProfileFormValues = {
  name: string;
  age: string;
  description: string;
};

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message: string;
  values: ProfileFormValues;
};

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name can't be empty")
    .max(50, "Name can be at most 50 characters"),
  age: z
    .string()
    .trim()
    .transform((age) => (age === "" ? null : Number(age)))
    .pipe(
      z
        .number("Age must be a number")
        .int("Age must be a whole number")
        .min(0, "Age can't be negative")
        .max(120, "Age can be at most 120")
        .nullable()
    )
    .transform((age) => age || null),
  description: z
    .string()
    .trim()
    .max(200, "Description can be at most 200 characters")
    .transform((description) => description || null),
});

export async function updateProfile(
  _previous: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const values: ProfileFormValues = {
    name: String(formData.get("name") ?? ""),
    age: String(formData.get("age") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Please sign in again to save your profile",
      values,
    };
  }

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message, values };
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: { username: true, name: true, age: true, description: true },
    });

    if (user.username) revalidateTag(profileTag(user.username));

    return {
      status: "success",
      message: "Profile saved",
      values: {
        name: user.name ?? "",
        age: user.age === null ? "" : String(user.age),
        description: user.description ?? "",
      },
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return { status: "error", message: "Could not save your profile", values };
  }
}
