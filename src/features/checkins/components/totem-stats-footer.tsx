"use client";

import { Users } from "lucide-react";

interface TotemStatsFooterProps {
  totalCheckins: number;
}

export function TotemStatsFooter({ totalCheckins }: TotemStatsFooterProps) {
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/25 text-white">
      <Users className="w-4 h-4 text-white/70 shrink-0" aria-hidden="true" />
      <span className="text-sm text-white/70">Total</span>
      <span className="text-sm font-bold">{totalCheckins}</span>
    </div>
  );
}
