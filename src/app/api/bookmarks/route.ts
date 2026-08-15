import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slugs: string[] = Array.isArray(body.slugs) ? body.slugs : [];

    if (slugs.length === 0) {
      return NextResponse.json({ articles: [], projects: [] });
    }

    const [articles, projects] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          slug: { in: slugs },
          isPublished: true,
        },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.project.findMany({
        where: {
          slug: { in: slugs },
          status: "PUBLISHED",
        },
        orderBy: { order: "asc" },
      }),
    ]);

    return NextResponse.json({ articles, projects });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}
