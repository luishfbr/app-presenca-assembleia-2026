"use server";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardInset } from "@/components/layout/dashboard-inset";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "@/server/session";
import type { User } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as User;

  if (user.role !== "admin") {
    redirect("/checkin");
  }

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar user={user} />
      <SidebarInset className="overflow-hidden">
        <DashboardHeader />
        <DashboardInset>{children}</DashboardInset>
      </SidebarInset>
    </SidebarProvider>
  );
}
