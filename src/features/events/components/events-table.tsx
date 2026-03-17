"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import type { EventWithStats } from "../types";
import { DeleteEvent } from "./delete-event";
import { UpdateEvent } from "./update-event";

function getEventStatus(event: EventWithStats) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  if (now < start) return { label: "Agendado", variant: "outline" as const };
  if (now > end) return { label: "Encerrado", variant: "secondary" as const };
  return { label: "Em andamento", variant: "default" as const };
}

export const EventsTable = ({ events }: { events: EventWithStats[] }) => {
  const router = useRouter();

  return (
    <Table>
      {events.length === 0 && (
        <TableCaption>Nenhum evento encontrado.</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Término</TableHead>
          <TableHead>Convidados</TableHead>
          <TableHead>Check-ins</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => {
          const status = getEventStatus(event);
          return (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
              <TableCell>
                {new Date(event.startDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                {new Date(event.endDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>{event.totalGuests}</TableCell>
              <TableCell>{event.totalCheckins}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => router.push(`/dashboard/events/${event.slug}`)}
                >
                  <Settings />
                </Button>
                <UpdateEvent event={event} />
                <DeleteEvent eventSlug={event.slug} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
