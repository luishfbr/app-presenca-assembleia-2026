"use client";

import { cn } from "@/lib/utils";

type TotemCardVariant = "neutral" | "success" | "warning" | "error";

const variantBorder: Record<TotemCardVariant, string> = {
  neutral: "border-white/25",
  success: "border-white/60",
  warning: "border-yellow-400/60",
  error: "border-red-400/60",
};

const variantAria: Record<
  TotemCardVariant,
  { role: "status" | "alert"; "aria-live": "polite" | "assertive" }
> = {
  neutral: { role: "status", "aria-live": "polite" },
  success: { role: "status", "aria-live": "polite" },
  warning: { role: "alert", "aria-live": "assertive" },
  error: { role: "alert", "aria-live": "assertive" },
};

interface TotemCardProps {
  variant?: TotemCardVariant;
  children: React.ReactNode;
}

export function TotemCard({ variant = "neutral", children }: TotemCardProps) {
  const aria = variantAria[variant];

  return (
    <div
      className={cn(
        "bg-black/30 backdrop-blur-md border-2 rounded-3xl p-10 space-y-8 text-center",
        variantBorder[variant]
      )}
      role={aria.role}
      aria-live={aria["aria-live"]}
    >
      {children}
    </div>
  );
}
