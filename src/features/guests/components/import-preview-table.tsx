"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Upload, X } from "lucide-react";
import type { ImportProgress } from "../hooks";
import type { ParsedGuestRow } from "../types";

interface ImportPreviewTableProps {
  rows: ParsedGuestRow[];
  isPending: boolean;
  progress: ImportProgress | null;
  onImport: () => void;
  onCancel: () => void;
}

const PREVIEW_LIMIT = 50;

export function ImportPreviewTable({ rows, isPending, progress, onImport, onCancel }: ImportPreviewTableProps) {
  const hasInvalid = rows.some((r) => !r.name || !r.document || !r.type);
  const validCount = rows.filter((r) => r.name && r.document && r.type).length;
  const progressPercent = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Pré-visualização</h2>
          <Badge variant="secondary">{rows.length} linha(s)</Badge>
          {hasInvalid && (
            <Badge variant="destructive">
              {rows.length - validCount} inválida(s)
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button onClick={onImport} disabled={isPending || validCount === 0}>
            {isPending ? (
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Importando...</>
            ) : (
              <><Upload className="h-4 w-4 mr-1" /> Importar {validCount} convidado(s)</>
            )}
          </Button>
        </div>
      </div>

      {isPending && progress && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Enviando lote {progress.current} de {progress.total}...</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {!isPending && rows.length > PREVIEW_LIMIT && (
        <p className="text-xs text-muted-foreground">
          Exibindo as primeiras {PREVIEW_LIMIT} de {rows.length} linhas. Todos serão importados.
        </p>
      )}

      <div className="flex-1 min-h-0 overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-20">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.slice(0, PREVIEW_LIMIT).map((row, i) => {
              const isInvalid = !row.name || !row.document || !row.type;
              return (
                <TableRow key={i} className={isInvalid ? "bg-destructive/5" : undefined}>
                  <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                  <TableCell className={!row.name ? "text-destructive" : undefined}>
                    {row.name || <span className="italic text-xs">vazio</span>}
                  </TableCell>
                  <TableCell className={!row.document ? "text-destructive" : undefined}>
                    {row.document || <span className="italic text-xs">vazio</span>}
                  </TableCell>
                  <TableCell className={!row.type ? "text-destructive" : undefined}>
                    {row.type || <span className="italic text-xs">vazio</span>}
                  </TableCell>
                  <TableCell>
                    {isInvalid ? (
                      <Badge variant="destructive" className="text-xs">Inválido</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">OK</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
