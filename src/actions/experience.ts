"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createExperience(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let skillsVal = formData.get("skills") as string;
  if (skillsVal && !skillsVal.startsWith("[")) {
    const arr = skillsVal.split(",").map((s) => s.trim()).filter(Boolean);
    skillsVal = JSON.stringify(arr);
  }

  const rawData = {
    title: formData.get("title") as string,
    organization: formData.get("organization") as string,
    location: (formData.get("location") as string) || null,
    period: formData.get("period") as string,
    description: formData.get("description") as string,
    type: (formData.get("type") as any) || "CAREER",
    skills: skillsVal || null,
    order: Number(formData.get("order")) || 0,
  };

  const validation = experienceSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const experience = await prisma.experience.create({
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "EXPERIENCE_CREATED",
        details: `Added timeline milestone: "${experience.title}" at ${experience.organization}`,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/experience");
    revalidatePath("/admin");

    return { success: true, experience };
  } catch (error) {
    console.error("Error creating experience:", error);
    return { success: false, error: "Database error creating experience" };
  }
}

export async function updateExperience(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let skillsVal = formData.get("skills") as string;
  if (skillsVal && !skillsVal.startsWith("[")) {
    const arr = skillsVal.split(",").map((s) => s.trim()).filter(Boolean);
    skillsVal = JSON.stringify(arr);
  }

  const rawData = {
    title: formData.get("title") as string,
    organization: formData.get("organization") as string,
    location: (formData.get("location") as string) || null,
    period: formData.get("period") as string,
    description: formData.get("description") as string,
    type: (formData.get("type") as any) || "CAREER",
    skills: skillsVal || null,
    order: Number(formData.get("order")) || 0,
  };

  const validation = experienceSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "EXPERIENCE_UPDATED",
        details: `Updated timeline milestone: "${experience.title}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/experience");
    revalidatePath("/admin");

    return { success: true, experience };
  } catch (error) {
    console.error("Error updating experience:", error);
    return { success: false, error: "Database error updating experience" };
  }
}

export async function deleteExperience(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in as admin." };
  }

  try {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Experience not found or already removed." };
    }

    const experience = await prisma.experience.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "EXPERIENCE_DELETED",
        details: `Deleted milestone: "${experience.title}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/experience");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting experience:", error);
    return { success: false, error: "Database error deleting experience" };
  }
}
