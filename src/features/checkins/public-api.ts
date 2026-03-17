import type { Guest } from "@/db/schema/presence/guests";
import type { Checkin } from "@/db/schema/presence/checkins";
import { axiosClient } from "@/lib/axios-client";
import type { CheckinStatsResponse } from "./types";

export const checkinPublicApi = {
  lookupByDocument: (document: string, eventSlug: string) =>
    axiosClient
      .get<{ data: Guest }>("/presences/checkin", { params: { document, eventSlug } })
      .then((r) => r.data),

  register: (guestId: string, eventSlug: string) =>
    axiosClient
      .post<{ data: Checkin }>("/presences/checkin", { guestId, eventSlug })
      .then((r) => r.data),

  getStats: (eventSlug: string) =>
    axiosClient
      .get<CheckinStatsResponse>("/presences/checkin/stats", { params: { eventSlug } })
      .then((r) => r.data),
};
