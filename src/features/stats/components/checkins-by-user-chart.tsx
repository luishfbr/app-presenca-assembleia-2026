"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import type { CheckinsByUserItem } from "../types";

const chartConfig: ChartConfig = {
  count: { label: "Checkins", color: "hsl(var(--chart-1))" },
};

interface CheckinsByUserChartProps {
  data: CheckinsByUserItem[];
}

export function CheckinsByUserChart({ data }: CheckinsByUserChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkins por Operador</CardTitle>
      </CardHeader>
      <CardPanel className="pb-4">
        {data.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart
              data={data}
              margin={{ top: 0, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="userName"
                tick={{ fontSize: 12 }}
                interval={0}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardPanel>
    </Card>
  );
}
