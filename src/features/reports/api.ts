import { axiosClient } from "@/lib/axios-client";
import type { GetReportResponse, ReportType } from "./types";

export const reportsApi = {
  get: (params: { eventSlug: string; type: ReportType }) =>
    axiosClient
      .get<GetReportResponse>("/admin/presences/reports", {
        params,
        timeout: 60000,
      })
      .then((r) => r.data),
};
