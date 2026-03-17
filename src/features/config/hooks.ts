import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { configApi } from "./api";
import { publicConfigApi } from "./public-api";
import type { UpdateConfigType } from "./validations";

export function useSiteConfig() {
  return useQuery({
    queryKey: ["site-config"],
    queryFn: () => configApi.get(),
  });
}

export function usePublicSiteConfig() {
  return useQuery({
    queryKey: ["site-config-public"],
    queryFn: () => publicConfigApi.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateConfigType) => configApi.update(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      toast.success("Configurações salvas com sucesso!");
    },
    onError: () => toast.error("Erro ao salvar configurações."),
  });
}

export function useUploadConfigImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      field,
      file,
    }: {
      field: "background" | "loading";
      file: File;
    }) => configApi.uploadImage(field, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      toast.success("Imagem atualizada!");
    },
    onError: () => toast.error("Erro ao fazer upload da imagem."),
  });
}
