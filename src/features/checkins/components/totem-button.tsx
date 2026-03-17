"use client";

import { cn } from "@/lib/utils";

type TotemButtonVariant = "primary" | "secondary";

interface TotemButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TotemButtonVariant;
}

export function TotemButton({
  variant = "primary",
  className,
  ...props
}: TotemButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-center rounded-2xl h-18 text-xl font-bold transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-white/90 text-green-800 border-2 border-white/60",
        variant === "secondary" && "bg-black/30 text-white border-2 border-white/25 active:bg-white/30",
        className
      )}
      {...props}
    />
  );
}
