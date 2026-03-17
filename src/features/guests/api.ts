import type { Guest, GuestUpdate } from "@/db/schema/presence/guests";
import { axiosClient } from "@/lib/axios-client";
import type { GetGuestsResponse, ImportGuestsResponse, ParsedGuestRow } from "./types";

export const guestsApi = {
  getAll: (params: { eventSlug: string; limit: number; offset: number; search: string }) =>
    axiosClient
      .get<GetGuestsResponse>("/admin/presences/guests", { params })
      .then((res) => res.data),

  getById: (id: string) =>
    axiosClient
      .get<{ data: Guest }>(`/admin/presences/guests/${id}`)
      .then((res) => res.data),

  create: (body: { eventSlug: string; name: string; document: string; type: string }) =>
    axiosClient
      .post<{ data: Guest }>("/admin/presences/guests", body)
      .then((res) => res.data),

  update: (id: string, body: GuestUpdate) =>
    axiosClient
      .patch<{ data: Guest }>(`/admin/presences/guests/${id}`, body)
      .then((res) => res.data),

  delete: (id: string) =>
    axiosClient
      .delete<{ data: Guest }>(`/admin/presences/guests/${id}`)
      .then((res) => res.data),

  importBatch: (eventSlug: string, rows: ParsedGuestRow[]) =>
    axiosClient
      .post<ImportGuestsResponse>(
        "/admin/presences/guests/import",
        { eventSlug, guests: rows },
        { timeout: 60000 },
      )
      .then((res) => res.data),

  deleteAll: (eventSlug: string) =>
    axiosClient
      .delete<{ success: boolean }>("/admin/presences/guests", { params: { eventSlug } })
      .then((res) => res.data),
};
