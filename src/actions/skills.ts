"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { skillSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createSkill(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    category: (formData.get("category") as any) || "FRONTEND",
    proficiency: Number(formData.get("proficiency")) || 85,
    icon: (formData.get("icon") as string) || null,
    yearsOfExp: (formData.get("yearsOfExp") as string) || null,
    isTopSkill: formData.get("isTopSkill") === "true" || formData.get("isTopSkill") === "on",
    order: Number(formData.get("order")) || 0,
  };

  const validation = skillSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const skill = await prisma.skill.create({
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "SKILL_CREATED",
        details: `Added skill: "${skill.name}" (${skill.category})`,
      },
    });

    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/about");
    revalidatePath("/admin/skills");
    revalidatePath("/admin");

    return { success: true, skill };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { success: false, error: "Database error creating skill" };
  }
}

export async function updateSkill(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    category: (formData.get("category") as any) || "FRONTEND",
    proficiency: Number(formData.get("proficiency")) || 85,
    icon: (formData.get("icon") as string) || null,
    yearsOfExp: (formData.get("yearsOfExp") as string) || null,
    isTopSkill: formData.get("isTopSkill") === "true" || formData.get("isTopSkill") === "on",
    order: Number(formData.get("order")) || 0,
  };

  const validation = skillSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "SKILL_UPDATED",
        details: `Updated skill: "${skill.name}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/about");
    revalidatePath("/admin/skills");
    revalidatePath("/admin");

    return { success: true, skill };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { success: false, error: "Database error updating skill" };
  }
}

export async function deleteSkill(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in as admin." };
  }

  try {
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Skill not found or already removed." };
    }

    const skill = await prisma.skill.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "SKILL_DELETED",
        details: `Deleted skill: "${skill.name}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/about");
    revalidatePath("/admin/skills");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { success: false, error: "Database error deleting skill" };
  }
}

export async function toggleSkillTop(id: string, isTopSkill: boolean) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in as admin." };
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: { isTopSkill },
    });

    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/admin/skills");
    return { success: true, skill };
  } catch (error) {
    console.error("Error toggling top skill:", error);
    return { success: false, error: "Database error toggling top skill status" };
  }
}
