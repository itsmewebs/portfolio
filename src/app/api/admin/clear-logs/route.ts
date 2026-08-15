import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "MAINTENANCE_CLEANUP",
        details: `Cleaned up ${deleted.count} legacy activity logs older than 30 days.`,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleted.count,
      message: `Cleaned ${deleted.count} logs older than 30 days`,
    });
  } catch (error) {
    console.error("Clear logs error:", error);
    return NextResponse.json({ error: "Failed to clear logs" }, { status: 500 });
  }
}
