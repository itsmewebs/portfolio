"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rawTitle = formData.get("title") as string;
  const rawSlug = (formData.get("slug") as string) || slugify(rawTitle || "");

  // Format tech stack as JSON array
  let techStackVal = formData.get("techStack") as string;
  if (techStackVal && !techStackVal.startsWith("[")) {
    const arrayItems = techStackVal.split(",").map((s) => s.trim()).filter(Boolean);
    techStackVal = JSON.stringify(arrayItems);
  }

  // Format features as JSON array if needed
  let featuresVal = formData.get("features") as string;
  if (featuresVal && !featuresVal.startsWith("[")) {
    const arrayItems = featuresVal.split("\n").map((s) => s.trim()).filter(Boolean);
    featuresVal = JSON.stringify(arrayItems);
  }

  // Format gallery images as JSON array if needed
  let galleryImagesVal = formData.get("galleryImages") as string;
  if (galleryImagesVal && !galleryImagesVal.startsWith("[")) {
    const arrayItems = galleryImagesVal.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    galleryImagesVal = JSON.stringify(arrayItems);
  }

  const rawData = {
    title: rawTitle,
    slug: rawSlug,
    description: formData.get("description") as string,
    longDescription: (formData.get("longDescription") as string) || null,
    imageUrl: formData.get("imageUrl") as string,
    galleryImages: galleryImagesVal || null,
    techStack: techStackVal,
    features: featuresVal || null,
    metrics: (formData.get("metrics") as string) || null,
    architecture: (formData.get("architecture") as string) || null,
    liveLink: (formData.get("liveLink") as string) || null,
    githubLink: (formData.get("githubLink") as string) || null,
    demoVideoUrl: (formData.get("demoVideoUrl") as string) || null,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    category: formData.get("category") as "WEB_DEV" | "NETWORKING" | "CLOUD_DEVOPS" | "CYBER_SEC" | "DATA_SCIENCE",
    status: formData.get("status") as "PUBLISHED" | "DRAFT" | "ARCHIVED",
    role: (formData.get("role") as string) || null,
    teamSize: (formData.get("teamSize") as string) || null,
    completionDate: (formData.get("completionDate") as string) || null,
    order: Number(formData.get("order")) || 0,
  };

  const validation = projectSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const existing = await prisma.project.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existing) {
      return { success: false, error: "A project with this URL slug already exists. Please choose a unique slug." };
    }

    const project = await prisma.project.create({
      data: {
        title: validation.data.title,
        slug: validation.data.slug,
        description: validation.data.description,
        longDescription: validation.data.longDescription,
        imageUrl: validation.data.imageUrl,
        galleryImages: validation.data.galleryImages || null,
        techStack: validation.data.techStack,
        features: validation.data.features,
        metrics: validation.data.metrics,
        architecture: validation.data.architecture,
        liveLink: validation.data.liveLink || null,
        githubLink: validation.data.githubLink || null,
        demoVideoUrl: validation.data.demoVideoUrl || null,
        isFeatured: validation.data.isFeatured,
        category: validation.data.category,
        status: validation.data.status,
        role: validation.data.role,
        teamSize: validation.data.teamSize,
        completionDate: validation.data.completionDate,
        order: validation.data.order,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_CREATED",
        details: `Created project: "${project.title}" (${project.category})`,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Database error creating project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in." };
  }

  const rawTitle = formData.get("title") as string;
  const rawSlug = (formData.get("slug") as string) || slugify(rawTitle || "");

  let techStackVal = formData.get("techStack") as string;
  if (techStackVal && !techStackVal.startsWith("[")) {
    const arrayItems = techStackVal.split(",").map((s) => s.trim()).filter(Boolean);
    techStackVal = JSON.stringify(arrayItems);
  }

  let featuresVal = formData.get("features") as string;
  if (featuresVal && !featuresVal.startsWith("[")) {
    const arrayItems = featuresVal.split("\n").map((s) => s.trim()).filter(Boolean);
    featuresVal = JSON.stringify(arrayItems);
  }

  let galleryImagesVal = formData.get("galleryImages") as string;
  if (galleryImagesVal && !galleryImagesVal.startsWith("[")) {
    const arrayItems = galleryImagesVal.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    galleryImagesVal = JSON.stringify(arrayItems);
  }

  const rawData = {
    title: rawTitle,
    slug: rawSlug,
    description: formData.get("description") as string,
    longDescription: (formData.get("longDescription") as string) || null,
    imageUrl: formData.get("imageUrl") as string,
    galleryImages: galleryImagesVal || null,
    techStack: techStackVal,
    features: featuresVal || null,
    metrics: (formData.get("metrics") as string) || null,
    architecture: (formData.get("architecture") as string) || null,
    liveLink: (formData.get("liveLink") as string) || null,
    githubLink: (formData.get("githubLink") as string) || null,
    demoVideoUrl: (formData.get("demoVideoUrl") as string) || null,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    category: formData.get("category") as "WEB_DEV" | "NETWORKING" | "CLOUD_DEVOPS" | "CYBER_SEC" | "DATA_SCIENCE",
    status: formData.get("status") as "PUBLISHED" | "DRAFT" | "ARCHIVED",
    role: (formData.get("role") as string) || null,
    teamSize: (formData.get("teamSize") as string) || null,
    completionDate: (formData.get("completionDate") as string) || null,
    order: Number(formData.get("order")) || 0,
  };

  const validation = projectSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const existing = await prisma.project.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existing && existing.id !== id) {
      return { success: false, error: "Another project with this slug already exists." };
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: validation.data.title,
        slug: validation.data.slug,
        description: validation.data.description,
        longDescription: validation.data.longDescription,
        imageUrl: validation.data.imageUrl,
        galleryImages: validation.data.galleryImages || null,
        techStack: validation.data.techStack,
        features: validation.data.features,
        metrics: validation.data.metrics,
        architecture: validation.data.architecture,
        liveLink: validation.data.liveLink || null,
        githubLink: validation.data.githubLink || null,
        demoVideoUrl: validation.data.demoVideoUrl || null,
        isFeatured: validation.data.isFeatured,
        category: validation.data.category,
        status: validation.data.status,
        role: validation.data.role,
        teamSize: validation.data.teamSize,
        completionDate: validation.data.completionDate,
        order: validation.data.order,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_UPDATED",
        details: `Updated project: "${project.title}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Database error updating project" };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in as admin." };
  }

  try {
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Project not found or already removed." };
    }

    const project = await prisma.project.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_DELETED",
        details: `Deleted project: "${project.title}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Database error deleting project" };
  }
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in as admin." };
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (error) {
    console.error("Error toggling featured:", error);
    return { success: false, error: "Database error updating featured status" };
  }
}
