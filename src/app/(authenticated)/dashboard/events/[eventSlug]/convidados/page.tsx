"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { ErrorComponent } from "@/components/ui/error-components";
import { Input } from "@/components/ui/input";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { Button } from "@/components/ui/button";
import { Sheet } from "lucide-react";
import { CreateGuest } from "@/features/guests/components/create-guest";
import { DeleteAllGuests } from "@/features/guests/components/delete-all-guests";
import { GuestsTable } from "@/features/guests/components/guests-table";
import { useGuests } from "@/features/guests/hooks";

const LIMIT = 14;

export default function EventGuestsPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = use(params);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * LIMIT;
  const { data, isPending, isFetching, error } = useGuests({
    eventSlug,
    limit: LIMIT,
    offset,
    search,
  });

  const totalPages = data ? Math.ceil(data.pagination.total / LIMIT) : 1;

  console.log(data?.pagination);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-row items-center justify-between">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nome..."
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/events/${eventSlug}/convidados/importar`)
            }
          >
            <Sheet />
            Inserir .csv
          </Button>
          <CreateGuest eventSlug={eventSlug} />
          <DeleteAllGuests
            eventSlug={eventSlug}
            hasGuests={data?.pagination.total ?? 0}
          />
        </div>
      </div>

      <div
        className={`flex-1 min-h-0 overflow-auto transition-opacity duration-200${
          isFetching && !isPending ? " opacity-50" : ""
        }`}
      >
        {isPending ? (
          <DefaultLoadingComponent />
        ) : error ? (
          <ErrorComponent message="Erro ao buscar convidados" />
        ) : (
          <GuestsTable guests={data.data} />
        )}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="text-xs flex flex-row gap-2 items-center">
          <p>Total de convidados:</p>
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
