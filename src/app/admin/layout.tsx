import React from "react";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If on login page, don't show sidebar & topbar
  if (!session?.user) {
    return <div className="min-h-screen relative z-10">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex relative">
      {/* Side Navigation Bar */}
      <AdminSidebar />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <AdminTopBar
          userEmail={session.user.email || "admin@alinets.com"}
        />

        <main className="flex-1 pt-24 px-8 pb-16 relative z-10">
          <div className="max-w-container-max mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
