"use client";

import { use } from "react";
import { ErrorComponent } from "@/components/ui/error-components";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { EventUsersTable } from "@/features/events/components/event-users-table";
import { AddUserToEvent } from "@/features/events/components/add-user-to-event";
import { useEventUsers } from "@/features/events/hooks";

export default function EventUsersPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = use(params);
  const { data, isPending, isError } = useEventUsers(eventSlug);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-end">
        <AddUserToEvent eventSlug={eventSlug} />
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {isPending ? (
          <DefaultLoadingComponent />
        ) : isError ? (
          <ErrorComponent message="Erro ao buscar usuários do evento" />
        ) : (
          <EventUsersTable
            eventSlug={eventSlug}
            eventUsers={data.data}
          />
        )}
      </div>
      {!isPending && !isError && (
        <div className="text-xs flex gap-2 items-center">
          <p>Total de usuários:</p>
          <span className="font-bold">{data?.data.length ?? 0}</span>
        </div>
      )}
    </div>
  );
}
