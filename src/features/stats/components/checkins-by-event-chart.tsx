"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import type { CheckinsByEventItem } from "../types";

const chartConfig: ChartConfig = {
  totalCheckins: { label: "Checkins", color: "hsl(var(--chart-1))" },
  totalGuests: { label: "Convidados", color: "hsl(var(--chart-2))" },
};

interface CheckinsByEventChartProps {
  data: CheckinsByEventItem[];
}

export function CheckinsByEventChart({ data }: CheckinsByEventChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidados e Checkins por Evento</CardTitle>
      </CardHeader>
      <CardPanel className="pb-4">
        {data.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="eventName"
                tick={{ fontSize: 11 }}
                interval={0}
                tickLine={false}
                axisLine={false}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="totalGuests"
                fill="var(--color-totalGuests)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalCheckins"
                fill="var(--color-totalCheckins)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardPanel>
    </Card>
  );
}
