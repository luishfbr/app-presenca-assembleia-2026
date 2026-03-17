"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { ErrorComponent } from "@/components/ui/error-components";
import { useGlobalStats } from "@/features/stats/hooks";
import { GlobalKpiCards } from "@/features/stats/components/global-kpi-cards";
import { CheckinsByEventChart } from "@/features/stats/components/checkins-by-event-chart";
import { CheckinsByUserChart } from "@/features/stats/components/checkins-by-user-chart";
import { EventsSummaryTable } from "@/features/stats/components/events-summary-table";
import { GlobalRecentCheckinsTable } from "@/features/stats/components/global-recent-checkins-table";

const REFRESH_INTERVAL_MS = 30_000;

export default function DashboardPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data, isPending, isError, refetch, isFetching } = useGlobalStats({
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

      <GlobalKpiCards data={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CheckinsByEventChart data={stats.checkinsByEvent} />
        <CheckinsByUserChart data={stats.checkinsByUser} />
      </div>

      <EventsSummaryTable data={stats.checkinsByEvent} />

      <GlobalRecentCheckinsTable data={stats.recentCheckins} />
    </div>
  );
}
