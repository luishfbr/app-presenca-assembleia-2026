"use client";

import { use, useState } from "react";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { ErrorComponent } from "@/components/ui/error-components";
import { Input } from "@/components/ui/input";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { CheckinsTable } from "@/features/checkins/components/checkins-table";
import { useCheckins } from "@/features/checkins/hooks";
import { ReportButtons } from "@/features/reports/components/report-buttons";

const LIMIT = 14;

export default function EventCheckinsPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = use(params);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * LIMIT;
  const { data, isPending, isFetching, error } = useCheckins({
    eventSlug,
    limit: LIMIT,
    offset,
    search,
  });

  const totalPages = data ? Math.ceil(data.pagination.total / LIMIT) : 1;

  return (
    <div className="flex flex-col gap-4 h-full">
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Buscar por nome do convidado..."
        className="max-w-sm"
      />
      <div
        className={`flex-1 min-h-0 overflow-auto transition-opacity duration-200${
          isFetching && !isPending ? " opacity-50" : ""
        }`}
      >
        {isPending ? (
          <DefaultLoadingComponent />
        ) : error ? (
          <ErrorComponent message="Erro ao buscar check-ins" />
        ) : (
          <CheckinsTable checkins={data.data} />
        )}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between flex-wrap">
        <div className="flex flex-row gap-2 items-center flex-wrap">
          <div className="text-xs flex flex-row gap-2 items-center">
            <p>Total de check-ins:</p>
            <span className="font-bold">{data?.pagination.total ?? 0}</span>
          </div>
          <ReportButtons eventSlug={eventSlug} />
        </div>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
