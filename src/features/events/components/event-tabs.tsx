"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, UserCheck, ClipboardList } from "lucide-react";

const TABS = [
  { label: "Visão Geral", segment: "", icon: BarChart3 },
  { label: "Convidados", segment: "convidados", icon: Users },
  { label: "Check-ins", segment: "checkins", icon: UserCheck },
  { label: "Usuários", segment: "usuarios", icon: ClipboardList },
] as const;

export const EventTabs = ({ eventSlug }: { eventSlug: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const base = `/dashboard/events/${eventSlug}`;

  return (
    <nav className="flex gap-1 border-b pb-0">
      {TABS.map(({ label, segment, icon: Icon }) => {
        const href = segment ? `${base}/${segment}` : base;
        const isActive = segment
          ? pathname.startsWith(`${base}/${segment}`)
          : pathname === base;

        return (
          <Button
            key={segment}
            variant="ghost"
            size="sm"
            onClick={() => router.push(href)}
            className={`rounded-b-none border-b-2 ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        );
      })}
    </nav>
  );
};
