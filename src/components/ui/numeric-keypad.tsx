"use client";

import { Delete, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumericKeypadProps {
  value: string;
  onChange: (val: string) => void;
  /** Chamado quando o usuário pressiona ✓ com `value.length === maxLength` */
  onSubmit: () => void;
  maxLength: number;
  disabled?: boolean;
}

/**
 * Formata os dígitos brutos como máscara de CPF: XXX.XXX.XXX-XX
 * Apenas os 3 últimos dígitos digitados ficam visíveis — os anteriores
 * são substituídos por "•" para preservar a privacidade do usuário.
 */
function formatCpf(raw: string): string {
  const padded = raw.padEnd(11, "_");
  const hiddenUntil = Math.max(0, raw.length - 3);
  const masked = padded
    .split("")
    .map((char, i) => (char !== "_" && i < hiddenUntil ? "•" : char))
    .join("");
  return `${masked.slice(0, 3)}.${masked.slice(3, 6)}.${masked.slice(6, 9)}-${masked.slice(9, 11)}`;
}

const DIGIT_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
] as const;

const keyBase =
  "flex items-center justify-center h-32 rounded-2xl border border-white/25 bg-black/30 backdrop-blur-md text-3xl font-bold text-white transition-all active:scale-95 active:bg-white/30 disabled:opacity-40 disabled:pointer-events-none";

/**
 * Teclado numérico virtual para entrada de CPF em telas touch.
 * Todos os estilos visuais estão encapsulados neste componente.
 * Tailwind é usado para layout (grid, flex, gap) e para os estilos de tecla.
 */
export function NumericKeypad({
  value,
  onChange,
  onSubmit,
  maxLength,
  disabled = false,
}: NumericKeypadProps) {
  function handleDigit(digit: string) {
    if (disabled || value.length >= maxLength) return;
    onChange(value + digit);
  }

  function handleBackspace() {
    if (disabled) return;
    onChange(value.slice(0, -1));
  }

  function handleConfirm() {
    if (disabled || value.length !== maxLength) return;
    onSubmit();
  }

  const canConfirm = !disabled && value.length === maxLength;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Display do CPF formatado */}
      <div className="rounded-2xl bg-black/30 border-2 border-white/25 p-8 text-center">
        <p className="text-lg font-semibold text-white/75 mb-1">CPF</p>
        <p className="text-4xl font-bold text-white font-mono tracking-[1rem]">
          {formatCpf(value)}
        </p>
      </div>

      {/* Grade de teclas */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {DIGIT_ROWS.map((row) =>
          row.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              disabled={disabled}
              className={keyBase}
              aria-label={digit}
            >
              {digit}
            </button>
          ))
        )}

        {/* Última linha: ⌫  0  ✓ */}
        <button
          type="button"
          onClick={handleBackspace}
          disabled={disabled || value.length === 0}
          className={keyBase}
          aria-label="Apagar"
        >
          <Delete className="size-8" />
        </button>

        <button
          type="button"
          onClick={() => handleDigit("0")}
          disabled={disabled}
          className={keyBase}
          aria-label="0"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={cn(
            keyBase,
            "bg-white/90 text-green-800 border-white/60 disabled:opacity-30"
          )}
          aria-label="Confirmar"
        >
          <Check className="size-8" />
        </button>
      </div>
    </div>
  );
}
