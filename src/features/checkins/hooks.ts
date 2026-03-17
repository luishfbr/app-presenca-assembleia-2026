"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkinsApi } from "./api";
import { checkinPublicApi } from "./public-api";

export function useCheckins(params: {
  eventSlug: string;
  limit: number;
  offset: number;
  search?: string;
  guestId?: string;
}) {
  return useQuery({
    queryKey: ["checkins", params],
    queryFn: () => checkinsApi.getAll(params),
    placeholderData: keepPreviousData,
    enabled: !!params.eventSlug,
  });
}

export function useCreateCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { eventSlug: string; guestId: string; userId: string }) => checkinsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins"] });
      toast.success("Check-in realizado com sucesso");
    },
    onError: () => toast.error("Erro ao realizar check-in"),
  });
}

export function useDeleteCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => checkinsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins"] });
      toast.success("Check-in removido com sucesso");
    },
    onError: () => toast.error("Erro ao remover check-in"),
  });
}

export function useCheckinStats(eventSlug: string) {
  return useQuery({
    queryKey: ["checkin-stats", eventSlug],
    queryFn: () => checkinPublicApi.getStats(eventSlug),
    enabled: !!eventSlug,
    refetchInterval: 30_000,
  });
}

export function useLookupGuest(eventSlug: string) {
  return useMutation({
    mutationFn: (document: string) =>
      checkinPublicApi.lookupByDocument(document, eventSlug),
  });
}

export function useRegisterCheckin(eventSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guestId: string) => checkinPublicApi.register(guestId, eventSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkin-stats", eventSlug] });
    },
  });
}
