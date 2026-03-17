"use client";

import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import type { ParsedGuestRow } from "../types";

const COLUMN_MAP: Record<string, keyof ParsedGuestRow> = {
  nome: "name",
  name: "name",
  documento: "document",
  document: "document",
  tipo: "type",
  type: "type",
};

function parseSheet(file: File): Promise<ParsedGuestRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: Record<string, unknown>[] = utils.sheet_to_json(sheet, { defval: "" });

        const parsed: ParsedGuestRow[] = rows.map((row) => {
          const normalized: Partial<ParsedGuestRow> = {};
          for (const [key, value] of Object.entries(row)) {
            const mapped = COLUMN_MAP[key.toLowerCase().trim()];
            if (mapped) normalized[mapped] = String(value).trim();
          }
          return {
            name: normalized.name ?? "",
            document: normalized.document ?? "",
            type: normalized.type ?? "",
          };
        });

        resolve(parsed.filter((r) => r.name || r.document || r.type));
      } catch {
        reject(new Error("Erro ao ler o arquivo"));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
    reader.readAsArrayBuffer(file);
  });
}

interface ImportGuestsProps {
  onParsed: (rows: ParsedGuestRow[]) => void;
}

export function ImportGuests({ onParsed }: ImportGuestsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext ?? "")) {
      setError("Formato inválido. Use CSV, XLSX ou XLS.");
      return;
    }
    setIsReading(true);
    try {
      const rows = await parseSheet(file);
      if (rows.length === 0) {
        setError("Nenhuma linha encontrada no arquivo.");
        return;
      }
      onParsed(rows);
    } catch {
      setError("Erro ao processar o arquivo. Verifique o formato.");
    } finally {
      setIsReading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-4 w-full max-w-lg
          border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30"}
        `}
      >
        <UploadCloud className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium">Arraste um arquivo ou clique para selecionar</p>
          <p className="text-sm text-muted-foreground mt-1">CSV, XLSX ou XLS</p>
        </div>
        <Button type="button" variant="outline" disabled={isReading}>
          {isReading ? "Lendo arquivo..." : "Selecionar arquivo"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="text-sm text-muted-foreground text-center max-w-sm">
        <p className="font-medium mb-1">Colunas esperadas no arquivo:</p>
        <p><span className="font-mono">nome</span> · <span className="font-mono">documento</span> · <span className="font-mono">tipo</span></p>
        <p className="text-xs mt-1">(também aceita em inglês: <span className="font-mono">name</span>, <span className="font-mono">document</span>, <span className="font-mono">type</span>)</p>
      </div>
    </div>
  );
}
