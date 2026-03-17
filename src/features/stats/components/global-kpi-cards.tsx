"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardPanel,
} from "@/components/ui/card";
import { CalendarDays, ClipboardCheck, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GlobalStatsData } from "../types";

const ATTENDANCE_GOOD_THRESHOLD = 50;

interface GlobalKpiCardsProps {
  data: GlobalStatsData;
}

export function GlobalKpiCards({ data }: GlobalKpiCardsProps) {
  const { totalEvents, totalGuests, totalCheckins, attendanceRate } = data;

  const cards = [
    {
      title: "Eventos",
      value: totalEvents.toString(),
      description: "eventos cadastrados",
      icon: CalendarDays,
    },
    {
      title: "Convidados",
      value: totalGuests.toLocaleString("pt-BR"),
      description: "total em todos os eventos",
      icon: Users,
    },
    {
      title: "Checkins",
      value: totalCheckins.toLocaleString("pt-BR"),
      description: "registros confirmados",
      icon: ClipboardCheck,
    },
    {
      title: "Taxa de Presença",
      value: `${attendanceRate.toFixed(1)}%`,
      description: "média geral de presença",
      icon: TrendingUp,
      valueClassName:
        attendanceRate >= ATTENDANCE_GOOD_THRESHOLD
          ? "text-green-600 dark:text-green-400"
          : "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle
                className={cn("text-3xl font-bold tabular-nums", card.valueClassName)}
              >
                {card.value}
              </CardTitle>
              <CardAction>
                <Icon className="size-5 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardPanel className="pt-0">
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardPanel>
          </Card>
        );
      })}
    </div>
  );
}
