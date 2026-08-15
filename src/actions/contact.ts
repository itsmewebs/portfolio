"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(formData: FormData) {
  const rawData = {
    senderName: formData.get("senderName"),
    senderEmail: formData.get("senderEmail"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  };

  const validation = contactSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    await prisma.message.create({
      data: {
        senderName: validation.data.senderName,
        senderEmail: validation.data.senderEmail,
        subject: validation.data.subject || null,
        message: validation.data.message,
      },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Thank you! Your message has been transmitted successfully.",
    };
  } catch (error) {
    console.error("Error creating contact message:", error);
    return {
      success: false,
      error: "Failed to dispatch message. Please try again later.",
    };
  }
}
