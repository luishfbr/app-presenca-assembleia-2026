import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Mascara os 9 primeiros dígitos do CPF, exibindo apenas os 2 dígitos verificadores. */
export function maskDocument(doc: string): string {
  const digits = doc.replace(/\D/g, "");
  if (digits.length === 11) {
    return `***.***.*${digits.slice(8, 9)}-${digits.slice(9)}`;
  }
  return doc.replace(/^.{9}/, (m) => "*".repeat(m.length));
}

/** Gera um slug URL-safe a partir de um nome. */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
