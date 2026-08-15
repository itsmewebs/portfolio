import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json({
      projects: [],
      posts: [],
      skills: [],
      experiences: [],
      certificates: [],
    });
  }

  try {
    const [projects, posts, skills, experiences, certificates] = await Promise.all([
      prisma.project.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { techStack: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          description: true,
        },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { tags: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          readingTime: true,
        },
        take: 5,
      }),
      prisma.skill.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
          category: true,
          proficiency: true,
        },
        take: 6,
      }),
      prisma.experience.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { organization: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          organization: true,
          period: true,
        },
        take: 4,
      }),
      prisma.certificate.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { issuer: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          issuer: true,
          issueDate: true,
        },
        take: 4,
      }),
    ]);

    // Score and rank projects by relevance
    const rankedProjects = projects
      .map((item) => {
        let score = 0;
        const lowerQ = q.toLowerCase();
        if (item.title.toLowerCase().includes(lowerQ)) score += 10;
        if (item.title.toLowerCase().startsWith(lowerQ)) score += 5;
        if (item.description.toLowerCase().includes(lowerQ)) score += 3;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);

    // Score and rank posts by relevance
    const rankedPosts = posts
      .map((item) => {
        let score = 0;
        const lowerQ = q.toLowerCase();
        if (item.title.toLowerCase().includes(lowerQ)) score += 10;
        if (item.title.toLowerCase().startsWith(lowerQ)) score += 5;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);

    const totalResultsCount =
      rankedProjects.length +
      rankedPosts.length +
      skills.length +
      experiences.length +
      certificates.length;

    return NextResponse.json({
      query: q,
      totalCount: totalResultsCount,
      projects: rankedProjects,
      posts: rankedPosts,
      skills,
      experiences,
      certificates,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
