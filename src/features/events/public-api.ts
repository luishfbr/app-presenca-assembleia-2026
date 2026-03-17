import { axiosClient } from "@/lib/axios-client";
import type { Event } from "@/db/schema/presence/events";

export const publicEventsApi = {
  getMyEvents: () =>
    axiosClient
      .get<{ data: Event[] }>("/presences/events")
      .then((r) => r.data),
};
