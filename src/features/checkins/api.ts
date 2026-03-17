import type { Checkin } from "@/db/schema/presence/checkins";
import { axiosClient } from "@/lib/axios-client";
import type { GetCheckinsResponse } from "./types";

export const checkinsApi = {
  getAll: (params: {
    eventSlug: string;
    limit: number;
    offset: number;
    search?: string;
    guestId?: string;
  }) =>
    axiosClient
      .get<GetCheckinsResponse>("/admin/presences/checkins", { params })
      .then((res) => res.data),

  getById: (id: string) =>
    axiosClient
      .get<{ data: Checkin }>(`/admin/presences/checkins/${id}`)
      .then((res) => res.data),

  create: (body: { eventSlug: string; guestId: string; userId: string }) =>
    axiosClient
      .post<{ data: Checkin }>("/admin/presences/checkins", body)
      .then((res) => res.data),

  delete: (id: string) =>
    axiosClient
      .delete<{ data: Checkin }>(`/admin/presences/checkins/${id}`)
      .then((res) => res.data),
};
