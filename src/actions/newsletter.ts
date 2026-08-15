"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { subscriberSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const name = (formData.get("name") as string)?.trim() || null;

  const validation = subscriberSchema.safeParse({ email, name });

  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const existing = await prisma.subscriber.findUnique({
      where: { email: validation.data.email },
    });

    if (existing) {
      if (existing.isActive) {
        return {
          success: true,
          message: "You are already subscribed to Ali's engineering & research briefings.",
        };
      } else {
        await prisma.subscriber.update({
          where: { id: existing.id },
          data: { isActive: true, unsubscribedAt: null },
        });

        await prisma.activityLog.create({
          data: {
            action: "NEWSLETTER_RESUBSCRIBED",
            details: `Subscriber reactivated: ${existing.email}`,
          },
        });

        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated successfully.",
        };
      }
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: validation.data.email,
        name: validation.data.name,
        isActive: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "NEWSLETTER_SUBSCRIBED",
        details: `New subscriber registered: ${subscriber.email}`,
      },
    });

    revalidatePath("/admin/subscribers");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Subscription confirmed! You will receive updates on new systems and technical research.",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { success: false, error: "Database error registering subscription. Please try again." };
  }
}

export async function getSubscribers() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.subscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });
}

export async function toggleSubscriberStatus(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const sub = await prisma.subscriber.findUnique({ where: { id } });
  if (!sub) return { success: false, error: "Subscriber not found" };

  const updated = await prisma.subscriber.update({
    where: { id },
    data: {
      isActive: !sub.isActive,
      unsubscribedAt: sub.isActive ? new Date() : null,
    },
  });

  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");

  return { success: true, subscriber: updated };
}

export async function deleteSubscriber(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.subscriber.delete({ where: { id } });

  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");

  return { success: true };
}
