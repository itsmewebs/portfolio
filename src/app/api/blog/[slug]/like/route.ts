import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        likes: {
          increment: 1,
        },
      },
      select: {
        id: true,
        slug: true,
        likes: true,
      },
    });

    return NextResponse.json({ success: true, likes: updatedPost.likes });
  } catch (error) {
    console.error("Error incrementing blog likes:", error);
    return NextResponse.json(
      { error: "Failed to record reaction" },
      { status: 500 }
    );
  }
}
