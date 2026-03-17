"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventsApi } from "./api";
import { publicEventsApi } from "./public-api";
import type { CreateEventType, UpdateEventType } from "./validations";

export function useEvents(params: { limit: number; offset: number; search?: string }) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEventType) => eventsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar evento."),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, body }: { slug: string; body: UpdateEventType }) =>
      eventsApi.update(slug, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar evento."),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => eventsApi.delete(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento excluído com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir evento."),
  });
}

export function useEventUsers(eventSlug: string) {
  return useQuery({
    queryKey: ["event-users", eventSlug],
    queryFn: () => eventsApi.getUsers(eventSlug),
    enabled: !!eventSlug,
  });
}

export function useAddUserToEvent(eventSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => eventsApi.addUser(eventSlug, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event-users", eventSlug] });
      toast.success("Usuário adicionado ao evento!");
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        toast.error("Usuário já está no evento.");
      } else {
        toast.error("Erro ao adicionar usuário.");
      }
    },
  });
}

export function useRemoveUserFromEvent(eventSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => eventsApi.removeUser(eventSlug, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event-users", eventSlug] });
      toast.success("Usuário removido do evento!");
    },
    onError: () => toast.error("Erro ao remover usuário."),
  });
}

export function useMyEvents() {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: () => publicEventsApi.getMyEvents(),
  });
}
