"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImportGuests } from "@/features/guests/components/import-guests";
import { ImportPreviewTable } from "@/features/guests/components/import-preview-table";
import { ImportResult } from "@/features/guests/components/import-result";
import { useImportGuests } from "@/features/guests/hooks";
import type { ImportGuestsResponse, ParsedGuestRow } from "@/features/guests/types";
import { ArrowLeft } from "lucide-react";

type Step = "upload" | "preview" | "result";

export default function EventImportGuestsPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = use(params);
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [rows, setRows] = useState<ParsedGuestRow[]>([]);
  const [result, setResult] = useState<ImportGuestsResponse | null>(null);

  const { importAll, isPending, progress } = useImportGuests(eventSlug);

  function handleParsed(parsed: ParsedGuestRow[]) {
    setRows(parsed);
    setStep("preview");
  }

  async function handleImport() {
    const validRows = rows.filter((r) => r.name && r.document && r.type);
    try {
      const data = await importAll(validRows);
      setResult(data);
      setStep("result");
    } catch {
      // erro já tratado no hook via toast
    }
  }

  function handleReset() {
    setRows([]);
    setResult(null);
    setStep("upload");
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(`/dashboard/events/${eventSlug}/convidados`)
          }
          disabled={isPending}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Importar Convidados</h1>
      </header>

      <div className="flex-1 min-h-0">
        {step === "upload" && <ImportGuests onParsed={handleParsed} />}
        {step === "preview" && (
          <ImportPreviewTable
            rows={rows}
            isPending={isPending}
            progress={progress}
            onImport={handleImport}
            onCancel={handleReset}
          />
        )}
        {step === "result" && result && (
          <ImportResult result={result} onReset={handleReset} eventSlug={eventSlug} />
        )}
      </div>
    </div>
  );
}
