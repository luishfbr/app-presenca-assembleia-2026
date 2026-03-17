export type ReportRow = {
  nome: string;
  documento: string;
  tipo: string;
  status: "Presente" | "Ausente";
  dataCheckin: string | null;
  operador: string | null;
};

export type ReportType = "full" | "checked" | "unchecked";

export type GetReportResponse = {
  data: ReportRow[];
};
