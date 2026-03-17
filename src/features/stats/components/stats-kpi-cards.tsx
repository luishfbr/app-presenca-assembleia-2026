"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardPanel,
} from "@/components/ui/card";
import {
  ClipboardCheck,
  Users,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatsData } from "../types";

const ATTENDANCE_GOOD_THRESHOLD = 50;

interface StatsKpiCardsProps {
  data: StatsData;
}

export function StatsKpiCards({ data }: StatsKpiCardsProps) {
  const { totalCheckins, totalGuests, attendanceRate, checkinsByUser } = data;

  const cards = [
    {
      title: "Total de Checkins",
      value: totalCheckins.toString(),
      description: "registros confirmados",
      icon: ClipboardCheck,
    },
    {
      title: "Convidados Cadastrados",
      value: totalGuests.toString(),
      description: "no sistema",
      icon: Users,
    },
    {
      title: "Taxa de Presença",
      value: `${attendanceRate.toFixed(1)}%`,
      description: "dos convidados fizeram checkin",
      icon: TrendingUp,
      valueClassName:
        attendanceRate >= ATTENDANCE_GOOD_THRESHOLD
          ? "text-green-600 dark:text-green-400"
          : "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Operadores Ativos",
      value: checkinsByUser.length.toString(),
      description: "usuários registraram checkins",
      icon: UserCheck,
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
