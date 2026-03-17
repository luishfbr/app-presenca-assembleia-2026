"use client";

import { use } from "react";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { ErrorComponent } from "@/components/ui/error-components";
import { useStats } from "@/features/stats/hooks";
import { StatsKpiCards } from "@/features/stats/components/stats-kpi-cards";
import { CheckinsByUserChart } from "@/features/stats/components/checkins-by-user-chart";
import { CheckinsByHourChart } from "@/features/stats/components/checkins-by-hour-chart";
import { RecentCheckinsTable } from "@/features/stats/components/recent-checkins-table";

const REFRESH_INTERVAL_MS = 30_000;

export default function EventOverviewPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = use(params);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data, isPending, isError, refetch, isFetching } = useStats({
    eventSlug,
    refetchInterval: autoRefresh ? REFRESH_INTERVAL_MS : undefined,
  });

  if (isPending) return <DefaultLoadingComponent />;
  if (isError) return <ErrorComponent />;

  const stats = data.data;

  return (
    <div className="flex flex-col gap-6 overflow-auto">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRefresh((prev) => !prev)}
        >
          {autoRefresh ? "Pausar atualização" : "Ativar atualização"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "animate-spin" : ""} />
        </Button>
      </div>

      <StatsKpiCards data={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CheckinsByUserChart data={stats.checkinsByUser} />
        <CheckinsByHourChart data={stats.checkinsByHour} />
      </div>

      <RecentCheckinsTable data={stats.recentCheckins} />
    </div>
  );
}
