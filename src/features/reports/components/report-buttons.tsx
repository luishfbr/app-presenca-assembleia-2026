"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useReport } from "@/features/reports/hooks";
import { Download } from "lucide-react";

interface ReportButtonsProps {
  eventSlug: string;
}

export function ReportButtons({ eventSlug }: ReportButtonsProps) {
  const full = useReport(eventSlug, "full");
  const checked = useReport(eventSlug, "checked");
  const unchecked = useReport(eventSlug, "unchecked");

  return (
    <div className="flex flex-row gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => full.mutate()}
        disabled={full.isPending}
      >
        {full.isPending ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Relatório completo
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => checked.mutate()}
        disabled={checked.isPending}
      >
        {checked.isPending ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Presenças
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => unchecked.mutate()}
        disabled={unchecked.isPending}
      >
        {unchecked.isPending ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Ausências
      </Button>
    </div>
  );
}
