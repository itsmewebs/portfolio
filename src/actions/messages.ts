"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleMessageRead(messageId: string, isRead: boolean) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.message.update({
      where: { id: messageId },
      data: { isRead },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error toggling message status:", error);
    return { success: false, error: "Failed to update message status" };
  }
}

export async function deleteMessage(messageId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.message.delete({
      where: { id: messageId },
    });

    await prisma.activityLog.create({
      data: {
        action: "MESSAGE_DELETED",
        details: `Deleted message ID: ${messageId}`,
      },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}
