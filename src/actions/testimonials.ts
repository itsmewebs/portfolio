"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitPublicTestimonial(formData: FormData) {
  const rawData = {
    authorName: formData.get("authorName") as string,
    authorTitle: formData.get("authorTitle") as string,
    authorCompany: formData.get("authorCompany") as string,
    authorAvatar: (formData.get("authorAvatar") as string) || null,
    quote: formData.get("quote") as string,
    rating: Number(formData.get("rating")) || 5,
    isApproved: false, // Requires admin moderation
    isFeatured: false,
    order: 10,
  };

  const validation = testimonialSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "PUBLIC_TESTIMONIAL_SUBMITTED",
        details: `Public recommendation submitted by "${testimonial.authorName}" (${testimonial.authorCompany}) - Pending review`,
      },
    });

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Your endorsement has been submitted! It will appear publicly after administrative verification.",
    };
  } catch (error) {
    console.error("Error submitting public testimonial:", error);
    return { success: false, error: "Failed to submit recommendation. Please try again." };
  }
}

export async function createTestimonial(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    authorName: formData.get("authorName") as string,
    authorTitle: formData.get("authorTitle") as string,
    authorCompany: formData.get("authorCompany") as string,
    authorAvatar: (formData.get("authorAvatar") as string) || null,
    quote: formData.get("quote") as string,
    rating: Number(formData.get("rating")) || 5,
    isApproved: formData.get("isApproved") === "true" || formData.get("isApproved") === "on",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    order: Number(formData.get("order")) || 0,
  };

  const validation = testimonialSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "TESTIMONIAL_CREATED",
        details: `Added testimonial from: "${testimonial.authorName}" (${testimonial.authorCompany})`,
      },
    });

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");

    return { success: true, testimonial };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Database error creating testimonial" };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    authorName: formData.get("authorName") as string,
    authorTitle: formData.get("authorTitle") as string,
    authorCompany: formData.get("authorCompany") as string,
    authorAvatar: (formData.get("authorAvatar") as string) || null,
    quote: formData.get("quote") as string,
    rating: Number(formData.get("rating")) || 5,
    isApproved: formData.get("isApproved") === "true" || formData.get("isApproved") === "on",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    order: Number(formData.get("order")) || 0,
  };

  const validation = testimonialSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validation.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "TESTIMONIAL_UPDATED",
        details: `Updated testimonial from: "${testimonial.authorName}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");

    return { success: true, testimonial };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Database error updating testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access. Please log in as admin." };
  }

  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Testimonial not found or already removed." };
    }

    const testimonial = await prisma.testimonial.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "TESTIMONIAL_DELETED",
        details: `Deleted testimonial from: "${testimonial.authorName}"`,
      },
    });

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Database error deleting testimonial" };
  }
}

export async function toggleTestimonialFeatured(id: string, isFeatured: boolean) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    return { success: true, testimonial };
  } catch (error) {
    console.error("Error toggling testimonial featured:", error);
    return { success: false, error: "Database error updating featured status" };
  }
}
