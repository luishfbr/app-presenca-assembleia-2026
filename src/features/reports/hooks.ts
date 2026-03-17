"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { reportsApi } from "./api";
import type { ReportRow, ReportType } from "./types";

function buildSheetData(rows: ReportRow[], type: ReportType) {
  if (type === "checked") {
    return rows.map((r) => ({
      Nome: r.nome,
      CPF: r.documento,
      Tipo: r.tipo,
      "Data/hora do check-in": r.dataCheckin ?? "",
      Operador: r.operador ?? "",
    }));
  }
  if (type === "unchecked") {
    return rows.map((r) => ({
      Nome: r.nome,
      CPF: r.documento,
      Tipo: r.tipo,
    }));
  }
  return rows.map((r) => ({
    Nome: r.nome,
    CPF: r.documento,
    Tipo: r.tipo,
    Status: r.status,
    "Data/hora do check-in": r.dataCheckin ?? "",
    Operador: r.operador ?? "",
  }));
}

function downloadXlsx(rows: ReportRow[], type: ReportType, eventSlug: string) {
  const sheetData = buildSheetData(rows, type);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const suffix =
    type === "checked" ? "presencas" : type === "unchecked" ? "ausencias" : "completo";
  a.download = `relatorio-${suffix}-${eventSlug}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function useReport(eventSlug: string, type: ReportType) {
  return useMutation({
    mutationFn: () => reportsApi.get({ eventSlug, type }),
    onSuccess: ({ data }) => {
      downloadXlsx(data, type, eventSlug);
      toast.success("Relatório baixado com sucesso!");
    },
    onError: () => toast.error("Erro ao gerar relatório."),
  });
}
