"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let tagsVal = formData.get("dynamicBrandingTags") as string;
  if (tagsVal && !tagsVal.startsWith("[")) {
    const arrayItems = tagsVal.split(",").map((s) => s.trim()).filter(Boolean);
    tagsVal = JSON.stringify(arrayItems);
  }

  const rawData = {
    siteTitle: formData.get("siteTitle") as string,
    heroGreeting: formData.get("heroGreeting") as string,
    heroTagline: formData.get("heroTagline") as string,
    heroDescription: formData.get("heroDescription") as string,
    aboutText: formData.get("aboutText") as string,
    statusBadgeText: (formData.get("statusBadgeText") as string) || undefined,
    availableForWork: formData.get("availableForWork") === "true" || formData.get("availableForWork") === "on",
    resumeLink: (formData.get("resumeLink") as string) || null,
    githubUrl: (formData.get("githubUrl") as string) || null,
    linkedinUrl: (formData.get("linkedinUrl") as string) || null,
    twitterUrl: (formData.get("twitterUrl") as string) || null,
    contactEmail: (formData.get("contactEmail") as string) || null,
    dynamicBrandingTags: tagsVal,
    footerText: (formData.get("footerText") as string) || null,
    metaImage: (formData.get("metaImage") as string) || null,
    particlesEnabled: formData.get("particlesEnabled") === "true" || formData.get("particlesEnabled") === "on",
    blogEnabled: formData.get("blogEnabled") === "true" || formData.get("blogEnabled") === "on",
    commandPaletteEnabled: formData.get("commandPaletteEnabled") === "true" || formData.get("commandPaletteEnabled") === "on",
  };

  const validation = siteSettingsSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  const updateData = {
    siteTitle: validation.data.siteTitle,
    heroGreeting: validation.data.heroGreeting,
    heroTagline: validation.data.heroTagline,
    heroDescription: validation.data.heroDescription,
    aboutText: validation.data.aboutText,
    statusBadgeText: validation.data.statusBadgeText || "ICT Specialist × Web Developer × Network Infrastructure Architect",
    availableForWork: validation.data.availableForWork,
    resumeLink: validation.data.resumeLink || null,
    githubUrl: validation.data.githubUrl || null,
    linkedinUrl: validation.data.linkedinUrl || null,
    twitterUrl: validation.data.twitterUrl || null,
    contactEmail: validation.data.contactEmail || null,
    dynamicBrandingTags: validation.data.dynamicBrandingTags,
    footerText: validation.data.footerText || null,
    metaImage: validation.data.metaImage || null,
    particlesEnabled: validation.data.particlesEnabled,
    blogEnabled: validation.data.blogEnabled,
    commandPaletteEnabled: validation.data.commandPaletteEnabled,
  };

  try {
    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: {
        id: "default",
        ...updateData,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "SETTINGS_UPDATED",
        details: "Site narrative, branding, and V3 feature toggles updated.",
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/skills");
    revalidatePath("/projects");
    revalidatePath("/blog");
    revalidatePath("/resume");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");

    return { success: true, settings: updated };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Database error updating site settings" };
  }
}
