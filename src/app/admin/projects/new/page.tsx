import React from "react";
import { ProjectForm } from "@/components/forms/ProjectForm";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div className="py-4">
      <ProjectForm />
    </div>
  );
}
