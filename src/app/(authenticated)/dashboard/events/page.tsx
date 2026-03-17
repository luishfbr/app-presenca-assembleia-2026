"use client";

import { useState } from "react";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { ErrorComponent } from "@/components/ui/error-components";
import { Input } from "@/components/ui/input";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { EventsTable } from "@/features/events/components/events-table";
import { CreateEvent } from "@/features/events/components/create-event";
import { useEvents } from "@/features/events/hooks";

const LIMIT = 10;

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * LIMIT;
  const { data, isPending, isFetching, error } = useEvents({ limit: LIMIT, offset, search });

  const totalPages = data ? Math.ceil(data.pagination.total / LIMIT) : 1;

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <CreateEvent />
      </header>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Buscar por nome..."
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
          <ErrorComponent message="Erro ao buscar eventos" />
        ) : (
          <EventsTable events={data.data} />
        )}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="text-xs flex flex-row gap-2 items-center">
          <p>Total de eventos:</p>
          <span className="font-bold">{data?.pagination.total ?? 0}</span>
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
