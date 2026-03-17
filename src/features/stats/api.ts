import { axiosClient } from "@/lib/axios-client";
import type { GetStatsResponse, GetGlobalStatsResponse } from "./types";

export const statsApi = {
  get: (eventSlug: string) =>
    axiosClient
      .get<GetStatsResponse>("/admin/presences/stats", { params: { eventSlug } })
      .then((res) => res.data),
  getGlobal: () =>
    axiosClient
      .get<GetGlobalStatsResponse>("/admin/presences/stats/global")
      .then((res) => res.data),
};
