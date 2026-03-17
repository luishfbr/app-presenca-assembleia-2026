import type { SiteConfig } from "@/db/schema/presence/site-config";

export const CONFIG_DEFAULTS = {
  welcomeTitle: "Bem-vindo(a)!",
  welcomeSubtitle: "Digite seu CPF para registrar presença",
  confirmButtonLabel: "Confirmar Presença",
  successTitle: "Presença confirmada!",
  duplicateTitle: "Presença já registrada",
  notFoundTitle: "CPF não encontrado",
  notFoundMessage:
    "Nenhum convidado encontrado com este CPF para este evento.",
  autoResetSeconds: 8,
  backgroundImageUrl: "/images/checkin-bg.png",
  loadingImageUrl: "/images/soccer-ball-loader.png",
} as const;

export function resolveConfig(config: SiteConfig | null) {
  return {
    welcomeTitle: config?.welcomeTitle ?? CONFIG_DEFAULTS.welcomeTitle,
    welcomeSubtitle: config?.welcomeSubtitle ?? CONFIG_DEFAULTS.welcomeSubtitle,
    confirmButtonLabel:
      config?.confirmButtonLabel ?? CONFIG_DEFAULTS.confirmButtonLabel,
    successTitle: config?.successTitle ?? CONFIG_DEFAULTS.successTitle,
    duplicateTitle: config?.duplicateTitle ?? CONFIG_DEFAULTS.duplicateTitle,
    notFoundTitle: config?.notFoundTitle ?? CONFIG_DEFAULTS.notFoundTitle,
    notFoundMessage: config?.notFoundMessage ?? CONFIG_DEFAULTS.notFoundMessage,
    autoResetSeconds:
      config?.autoResetSeconds ?? CONFIG_DEFAULTS.autoResetSeconds,
    backgroundImageUrl:
      config?.backgroundImageUrl ?? CONFIG_DEFAULTS.backgroundImageUrl,
    backgroundColorHex: config?.backgroundColorHex ?? null,
    loadingImageUrl: config?.loadingImageUrl ?? CONFIG_DEFAULTS.loadingImageUrl,
  };
}

export type ResolvedConfig = ReturnType<typeof resolveConfig>;
