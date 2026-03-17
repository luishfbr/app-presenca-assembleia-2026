import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Mascara os 9 primeiros dígitos do CPF, exibindo apenas os 2 dígitos verificadores. */
export function maskDocument(doc: string): string {
  return doc.replace(/^\d{3}\.\d{3}\.\d{3}-/, "***.***.***-");
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
