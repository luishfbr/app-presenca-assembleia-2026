import { axiosClient } from "@/lib/axios-client";
import type {
  GetEventsWithStatsResponse,
  GetEventUsersResponse,
} from "./types";
import type { Event } from "@/db/schema/presence/events";
import type { CreateEventType, UpdateEventType } from "./validations";

export const eventsApi = {
  getAll: (params: { limit: number; offset: number; search?: string }) =>
    axiosClient
      .get<GetEventsWithStatsResponse>("/admin/presences/events", { params })
      .then((r) => r.data),

  getBySlug: (slug: string) =>
    axiosClient
      .get<{ data: Event }>(`/admin/presences/events/${slug}`)
      .then((r) => r.data),

  create: (body: CreateEventType) =>
    axiosClient
      .post<{ data: Event }>("/admin/presences/events", body)
      .then((r) => r.data),

  update: (slug: string, body: UpdateEventType) =>
    axiosClient
      .patch<{ data: Event }>(`/admin/presences/events/${slug}`, body)
      .then((r) => r.data),

  delete: (slug: string) =>
    axiosClient
      .delete<{ data: Event }>(`/admin/presences/events/${slug}`)
      .then((r) => r.data),

  getUsers: (eventSlug: string) =>
    axiosClient
      .get<GetEventUsersResponse>(`/admin/presences/events/${eventSlug}/users`)
      .then((r) => r.data),

  addUser: (eventSlug: string, userId: string) =>
    axiosClient
      .post<{ data: { eventSlug: string; userId: string } }>(
        `/admin/presences/events/${eventSlug}/users`,
        { userId },
      )
      .then((r) => r.data),

  removeUser: (eventSlug: string, userId: string) =>
    axiosClient
      .delete(`/admin/presences/events/${eventSlug}/users/${userId}`)
      .then((r) => r.data),
};
