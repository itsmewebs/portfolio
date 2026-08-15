"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { certificateSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createCertificate(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  const rawData = {
    title: formData.get("title") as string,
    issuer: formData.get("issuer") as string,
    issueDate: formData.get("issueDate") as string,
    expiryDate: (formData.get("expiryDate") as string) || null,
    credentialUrl: (formData.get("credentialUrl") as string) || null,
    credentialId: (formData.get("credentialId") as string) || null,
    imageUrl: (formData.get("imageUrl") as string) || null,
    category: (formData.get("category") as "TECH" | "NETWORKING" | "CLOUD" | "DATA_AI") || "TECH",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = certificateSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const cert = await prisma.certificate.create({
      data: parsed.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_CERTIFICATE",
        details: `Created certificate: ${cert.title} (${cert.issuer})`,
      },
    });

    revalidatePath("/about");
    revalidatePath("/resume");
    revalidatePath("/admin/certificates");
    revalidatePath("/admin");

    return { success: true, certificate: cert };
  } catch (error) {
    console.error("Failed to create certificate:", error);
    return { success: false, error: "Database error creating certificate" };
  }
}

export async function updateCertificate(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  const rawData = {
    title: formData.get("title") as string,
    issuer: formData.get("issuer") as string,
    issueDate: formData.get("issueDate") as string,
    expiryDate: (formData.get("expiryDate") as string) || null,
    credentialUrl: (formData.get("credentialUrl") as string) || null,
    credentialId: (formData.get("credentialId") as string) || null,
    imageUrl: (formData.get("imageUrl") as string) || null,
    category: (formData.get("category") as "TECH" | "NETWORKING" | "CLOUD" | "DATA_AI") || "TECH",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = certificateSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const cert = await prisma.certificate.update({
      where: { id },
      data: parsed.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE_CERTIFICATE",
        details: `Updated certificate: ${cert.title}`,
      },
    });

    revalidatePath("/about");
    revalidatePath("/resume");
    revalidatePath("/admin/certificates");
    revalidatePath("/admin");

    return { success: true, certificate: cert };
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return { success: false, error: "Database error updating certificate" };
  }
}

export async function deleteCertificate(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    const cert = await prisma.certificate.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "DELETE_CERTIFICATE",
        details: `Deleted certificate: ${cert.title}`,
      },
    });

    revalidatePath("/about");
    revalidatePath("/resume");
    revalidatePath("/admin/certificates");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return { success: false, error: "Failed to delete certificate" };
  }
}
