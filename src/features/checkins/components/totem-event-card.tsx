"use client";

import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type EventStatus = "Em andamento" | "Agendado" | "Encerrado";

function getEventStatus(
  startDate: Date | string,
  endDate: Date | string
): EventStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "Agendado";
  if (now > end) return "Encerrado";
  return "Em andamento";
}

const statusCardBorder: Record<EventStatus, string> = {
  "Em andamento": "border-white/60",
  Agendado: "border-white/25",
  Encerrado: "border-white/10",
};

const statusBadge: Record<EventStatus, string> = {
  "Em andamento": "bg-white/90 text-green-800",
  Agendado: "bg-white/20 text-white",
  Encerrado: "bg-black/30 text-white/50",
};

interface TotemEventCardProps {
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  onClick: () => void;
}

export function TotemEventCard({
  name,
  startDate,
  endDate,
  onClick,
}: TotemEventCardProps) {
  const status = getEventStatus(startDate, endDate);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Selecionar evento: ${name}, status: ${status}`}
      className={cn(
        "w-full min-h-35 border-2 bg-black/30 backdrop-blur-md rounded-2xl p-8 text-left active:scale-[0.98] active:bg-white/30 transition-all",
        statusCardBorder[status]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <CalendarDays
          className="w-10 h-10 text-white/70 mt-1 shrink-0"
          aria-hidden="true"
        />
        <span
          className={cn(
            "text-lg px-4 py-1 rounded-full font-semibold shrink-0",
            statusBadge[status]
          )}
        >
          {status}
        </span>
      </div>
      <p className="mt-4 text-white font-bold text-3xl leading-tight">{name}</p>
      <p className="mt-2 text-white/60 text-xl">
        {new Date(startDate).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </button>
  );
}
