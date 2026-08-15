import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Article slug is required" }, { status: 400 });
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        slug: true,
        views: true,
      },
    });

    return NextResponse.json({
      success: true,
      slug: updatedPost.slug,
      views: updatedPost.views,
    });
  } catch (error) {
    console.error("Error updating article view count:", error);
    return NextResponse.json(
      { error: "Failed to record article view" },
      { status: 500 }
    );
  }
}
