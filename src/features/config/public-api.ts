import { axiosClient } from "@/lib/axios-client";
import type { GetSiteConfigResponse } from "./types";

export const publicConfigApi = {
  get: () =>
    axiosClient
      .get<GetSiteConfigResponse>("/presences/config")
      .then((r) => r.data),
};
