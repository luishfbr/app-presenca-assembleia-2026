import { useQuery } from "@tanstack/react-query";
import { statsApi } from "./api";

export function useStats(options?: { eventSlug?: string; refetchInterval?: number }) {
  return useQuery({
    queryKey: ["stats", options?.eventSlug],
    queryFn: () => statsApi.get(options?.eventSlug ?? ""),
    enabled: !!options?.eventSlug,
    refetchInterval: options?.refetchInterval,
  });
}

export function useGlobalStats(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ["stats-global"],
    queryFn: () => statsApi.getGlobal(),
    refetchInterval: options?.refetchInterval,
  });
}
