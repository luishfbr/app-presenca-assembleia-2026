"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, RefreshCw, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ImportGuestsResponse } from "../types";

interface ImportResultProps {
  result: ImportGuestsResponse;
  onReset: () => void;
  eventSlug: string;
}

export function ImportResult({ result, onReset, eventSlug }: ImportResultProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
        <h2 className="font-semibold text-lg">Importação concluída</h2>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 border rounded-lg p-4 flex-1">
          <span className="text-2xl font-bold text-green-600">{result.inserted}</span>
          <span className="text-sm text-muted-foreground">Inserido(s)</span>
        </div>
        <div className="flex flex-col gap-1 border rounded-lg p-4 flex-1">
          <span className="text-2xl font-bold text-yellow-600">{result.duplicates}</span>
          <span className="text-sm text-muted-foreground">Duplicata(s) ignorada(s)</span>
        </div>
        <div className="flex flex-col gap-1 border rounded-lg p-4 flex-1">
          <span className="text-2xl font-bold text-destructive">
            {result.errors.length}
          </span>
          <span className="text-sm text-muted-foreground">Erro(s)</span>
        </div>
      </div>

      {result.errors.length > 0 && (
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <p className="text-sm font-medium">Detalhes dos erros:</p>
          <div className="overflow-auto border rounded-md flex-1 min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Linha</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.errors.map((err, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground text-xs">{err.row}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {err.document}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-destructive">{err.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Importar outro arquivo
        </Button>
        <Button onClick={() => router.push(`/dashboard/events/${eventSlug}/convidados`)}>
          <Users className="h-4 w-4 mr-1" />
          Ver convidados
        </Button>
      </div>
    </div>
  );
}
