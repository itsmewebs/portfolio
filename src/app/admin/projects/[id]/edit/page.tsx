import React from "react";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="py-4">
      <ProjectForm initialData={project} isEdit={true} />
    </div>
  );
}
