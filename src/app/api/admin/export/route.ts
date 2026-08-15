import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      projects,
      blogPosts,
      skills,
      experiences,
      certificates,
      testimonials,
      subscribers,
      siteSettings,
      activityLogs,
    ] = await Promise.all([
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.certificate.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    ]);

    const exportPayload = {
      version: "7.0.0",
      system: "Ali Enterprise Platform (alinets.com)",
      exportedAt: new Date().toISOString(),
      recordCounts: {
        projects: projects.length,
        blogPosts: blogPosts.length,
        skills: skills.length,
        experiences: experiences.length,
        certificates: certificates.length,
        testimonials: testimonials.length,
        subscribers: subscribers.length,
        activityLogs: activityLogs.length,
      },
      data: {
        siteSettings,
        projects,
        blogPosts,
        skills,
        experiences,
        certificates,
        testimonials,
        subscribers,
        activityLogs,
      },
    };

    const fileName = `alinets-backup-v7-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Admin data export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
