"use client";

import type { GuestUpdate } from "@/db/schema/presence/guests";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { guestsApi } from "./api";
import type { ImportGuestsResponse, ParsedGuestRow } from "./types";

export function useGuests(params: {
  eventSlug: string;
  limit: number;
  offset: number;
  search: string;
}) {
  return useQuery({
    queryKey: ["guests", params],
    queryFn: async () => await guestsApi.getAll(params),
    placeholderData: keepPreviousData,
    enabled: !!params.eventSlug,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { eventSlug: string; name: string; document: string; type: string }) => guestsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success("Convidado criado com sucesso");
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        toast.error("Documento já cadastrado neste evento.");
      } else {
        toast.error("Erro ao criar convidado");
      }
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: GuestUpdate }) =>
      guestsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success("Convidado atualizado com sucesso");
    },
    onError: () => toast.error("Erro ao atualizar convidado"),
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success("Convidado excluído com sucesso");
    },
    onError: () => toast.error("Erro ao excluir convidado"),
  });
}

export function useDeleteAllGuests(eventSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => guestsApi.deleteAll(eventSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["checkins"] });
      toast.success("Todos os convidados foram excluídos");
    },
    onError: () => toast.error("Erro ao excluir convidados"),
  });
}

const IMPORT_CHUNK_SIZE = 500;

export type ImportProgress = { current: number; total: number };

export function useImportGuests(eventSlug: string) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);

  async function importAll(rows: ParsedGuestRow[]): Promise<ImportGuestsResponse> {
    const chunks: ParsedGuestRow[][] = [];
    for (let i = 0; i < rows.length; i += IMPORT_CHUNK_SIZE) {
      chunks.push(rows.slice(i, i + IMPORT_CHUNK_SIZE));
    }

    let totalInserted = 0;
    let totalDuplicates = 0;
    const allErrors: ImportGuestsResponse["errors"] = [];

    setIsPending(true);
    setProgress({ current: 0, total: chunks.length });

    try {
      for (let i = 0; i < chunks.length; i++) {
        const result = await guestsApi.importBatch(eventSlug, chunks[i]);
        totalInserted += result.inserted;
        totalDuplicates += result.duplicates;
        allErrors.push(...result.errors);
        setProgress({ current: i + 1, total: chunks.length });
      }

      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success(`${totalInserted} convidado(s) importado(s) com sucesso`);
      return { inserted: totalInserted, duplicates: totalDuplicates, errors: allErrors };
    } catch {
      toast.error("Erro ao importar convidados");
      throw new Error("Erro ao importar convidados");
    } finally {
      setIsPending(false);
      setProgress(null);
    }
  }

  return { importAll, isPending, progress };
}
