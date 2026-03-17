"use client";

import { useId } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import type { CheckinsByHourItem } from "../types";

const chartConfig: ChartConfig = {
  count: { label: "Checkins", color: "hsl(var(--chart-2))" },
};

interface CheckinsByHourChartProps {
  data: CheckinsByHourItem[];
}

export function CheckinsByHourChart({ data }: CheckinsByHourChartProps) {
  const gradId = useId();
  const isEmpty = data.every((d) => d.count === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Hora do Dia</CardTitle>
      </CardHeader>
      <CardPanel className="pb-4">
        {isEmpty ? (
          <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={2}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                fill={`url(#${gradId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardPanel>
    </Card>
  );
}
