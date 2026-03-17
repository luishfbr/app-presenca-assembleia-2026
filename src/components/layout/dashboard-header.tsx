"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";

type BreadcrumbEntry = { label: string; href?: string };

function useBreadcrumbs(): BreadcrumbEntry[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  // segments[0] === "dashboard"

  if (segments.length <= 1) {
    return [{ label: "Dashboard" }];
  }

  const section = segments[1];

  if (section === "events") {
    if (segments.length === 2) {
      return [{ label: "Eventos" }];
    }

    const slug = segments[2];
    const slugLabel = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (segments.length === 3) {
      return [
        { label: "Eventos", href: "/dashboard/events" },
        { label: slugLabel },
      ];
    }

    const subSection = segments[3];
    const subLabels: Record<string, string> = {
      checkins: "Check-ins",
      convidados: "Convidados",
      usuarios: "Usuários",
    };

    if (subSection === "convidados" && segments[4] === "importar") {
      return [
        { label: "Eventos", href: "/dashboard/events" },
        { label: slugLabel, href: `/dashboard/events/${slug}` },
        { label: "Convidados", href: `/dashboard/events/${slug}/convidados` },
        { label: "Importar" },
      ];
    }

    return [
      { label: "Eventos", href: "/dashboard/events" },
      { label: slugLabel, href: `/dashboard/events/${slug}` },
      { label: subLabels[subSection] ?? subSection },
    ];
  }

  if (section === "usuarios") {
    return [{ label: "Usuários" }];
  }

  if (section === "config") {
    return [{ label: "Configurações" }];
  }

  return [{ label: section }];
}

export const DashboardHeader = () => {
  const crumbs = useBreadcrumbs();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm px-4 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {i < crumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
};
