"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";
import { slugify, calculateReadingTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  const title = (formData.get("title") as string) || "";
  const slugInput = (formData.get("slug") as string) || slugify(title);
  const content = (formData.get("content") as string) || "";
  const rawTags = (formData.get("tags") as string) || "[]";
  let formattedTags = "[]";
  try {
    const parsed = JSON.parse(rawTags);
    formattedTags = Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([rawTags]);
  } catch {
    formattedTags = JSON.stringify(
      rawTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  const userReadingTime = (formData.get("readingTime") as string)?.trim();
  const computedReadingTime = userReadingTime && userReadingTime !== "5 min read" 
    ? userReadingTime 
    : calculateReadingTime(content);

  const rawData = {
    title,
    slug: slugify(slugInput),
    excerpt: formData.get("excerpt") as string,
    content,
    coverImage: (formData.get("coverImage") as string) || null,
    category: (formData.get("category") as "ENGINEERING" | "NETWORKING" | "CLOUD_DEVOPS" | "WEB_DEV" | "THOUGHTS") || "ENGINEERING",
    tags: formattedTags,
    readingTime: computedReadingTime,
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
  };

  const parsed = blogPostSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const post = await prisma.blogPost.create({
      data: parsed.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_BLOG_POST",
        details: `Published blog article: ${post.title}`,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/blog");
    revalidatePath("/admin");

    return { success: true, post };
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return { success: false, error: "Database error creating blog post (slug may already exist)" };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  const title = (formData.get("title") as string) || "";
  const slugInput = (formData.get("slug") as string) || slugify(title);
  const content = (formData.get("content") as string) || "";
  const rawTags = (formData.get("tags") as string) || "[]";
  let formattedTags = "[]";
  try {
    const parsed = JSON.parse(rawTags);
    formattedTags = Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([rawTags]);
  } catch {
    formattedTags = JSON.stringify(
      rawTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  const userReadingTime = (formData.get("readingTime") as string)?.trim();
  const computedReadingTime = userReadingTime && userReadingTime !== "5 min read"
    ? userReadingTime
    : calculateReadingTime(content);

  const rawData = {
    title,
    slug: slugify(slugInput),
    excerpt: formData.get("excerpt") as string,
    content,
    coverImage: (formData.get("coverImage") as string) || null,
    category: (formData.get("category") as "ENGINEERING" | "NETWORKING" | "CLOUD_DEVOPS" | "WEB_DEV" | "THOUGHTS") || "ENGINEERING",
    tags: formattedTags,
    readingTime: computedReadingTime,
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
  };

  const parsed = blogPostSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: parsed.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE_BLOG_POST",
        details: `Updated blog article: ${post.title}`,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/blog");
    revalidatePath("/admin");

    return { success: true, post };
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return { success: false, error: "Database error updating blog post" };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    const post = await prisma.blogPost.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "DELETE_BLOG_POST",
        details: `Deleted blog article: ${post.title}`,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/admin/blog");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

export async function incrementBlogViews(slug: string) {
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
    return { success: true };
  } catch (e) {
    // Non-critical, ignore view counter error
    return { success: false };
  }
}
