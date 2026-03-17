"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { useAutoReset } from "@/hooks/use-auto-reset";
import {
  useLookupGuest,
  useRegisterCheckin,
  useCheckinStats,
} from "@/features/checkins/hooks";
import type { Guest } from "@/db/schema/presence/guests";
import type { ResolvedConfig } from "@/features/config/defaults";
import { CONFIG_DEFAULTS } from "@/features/config/defaults";
import { CountdownBar } from "./countdown-bar";
import { TotemCard } from "./totem-card";
import { TotemButton } from "./totem-button";
import { TotemStatsFooter } from "./totem-stats-footer";

type Step = "idle" | "found" | "success" | "duplicate" | "not_found" | "error";

interface KioskCheckinProps {
  eventSlug: string;
  config?: ResolvedConfig;
}

export function KioskCheckin({ eventSlug, config }: KioskCheckinProps) {
  const cfg = config ?? {
    welcomeTitle: CONFIG_DEFAULTS.welcomeTitle,
    welcomeSubtitle: CONFIG_DEFAULTS.welcomeSubtitle,
    confirmButtonLabel: CONFIG_DEFAULTS.confirmButtonLabel,
    successTitle: CONFIG_DEFAULTS.successTitle,
    duplicateTitle: CONFIG_DEFAULTS.duplicateTitle,
    notFoundTitle: CONFIG_DEFAULTS.notFoundTitle,
    notFoundMessage: CONFIG_DEFAULTS.notFoundMessage,
    autoResetSeconds: CONFIG_DEFAULTS.autoResetSeconds,
    backgroundImageUrl: CONFIG_DEFAULTS.backgroundImageUrl,
    loadingImageUrl: CONFIG_DEFAULTS.loadingImageUrl,
  };
  const [step, setStep] = useState<Step>("idle");
  const [cpf, setCpf] = useState("");
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null);

  const lookup = useLookupGuest(eventSlug);
  const register = useRegisterCheckin(eventSlug);
  const { data: statsData } = useCheckinStats(eventSlug);

  const totalCheckins = statsData?.data.totalCheckins ?? 0;

  const isAutoResetting =
    step === "success" || step === "duplicate" || step === "not_found" || step === "error";
  const countdown = useAutoReset(isAutoResetting, resetFlow, cfg.autoResetSeconds);

  function resetFlow() {
    setStep("idle");
    setCpf("");
    setFoundGuest(null);
  }

  function handleCpfSubmit() {
    lookup.mutate(cpf, {
      onSuccess: ({ data }) => {
        setFoundGuest(data);
        setStep("found");
      },
      onError: (err: any) => {
        setStep(err?.response?.status === 404 ? "not_found" : "error");
      },
    });
  }

  function handleConfirmCheckin() {
    if (!foundGuest) return;
    register.mutate(foundGuest.id, {
      onSuccess: () => setStep("success"),
      onError: (err: any) => {
        setStep(err?.response?.status === 409 ? "duplicate" : "error");
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 gap-8">
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-6">

          {/* IDLE — entrada de CPF via teclado virtual */}
          {step === "idle" && (
            <>
              <div className="text-center text-white space-y-2">
                <h1 className="text-5xl font-bold">{cfg.welcomeTitle}</h1>
                <p className="text-2xl text-white/85">{cfg.welcomeSubtitle}</p>
              </div>
              <NumericKeypad
                value={cpf}
                onChange={setCpf}
                onSubmit={handleCpfSubmit}
                maxLength={11}
                disabled={lookup.isPending}
              />
            </>
          )}

          {/* FOUND — confirmar identidade */}
          {step === "found" && foundGuest && (
            <TotemCard variant="neutral">
              <CheckCircle2 className="w-20 h-20 text-green-300 mx-auto" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-2xl text-white/80">Convidado encontrado</p>
                <p className="text-5xl font-bold text-white leading-tight">{foundGuest.name}</p>
              </div>
              <div className="flex gap-4">
                <TotemButton
                  variant="secondary"
                  onClick={resetFlow}
                  className="flex-1"
                  aria-label="Cancelar e voltar"
                >
                  Cancelar
                </TotemButton>
                <TotemButton
                  variant="primary"
                  onClick={handleConfirmCheckin}
                  disabled={register.isPending}
                  className="flex-1"
                  aria-label="Confirmar presença"
                >
                  {register.isPending ? "Registrando..." : cfg.confirmButtonLabel}
                </TotemButton>
              </div>
            </TotemCard>
          )}

          {/* SUCCESS — presença confirmada */}
          {step === "success" && foundGuest && (
            <TotemCard variant="success">
              <CheckCircle2 className="w-32 h-32 text-green-300 mx-auto" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-5xl font-bold text-green-200">{cfg.successTitle}</p>
                <p className="text-4xl font-bold text-white">{foundGuest.name}</p>
              </div>
              <CountdownBar countdown={countdown} total={cfg.autoResetSeconds} color="bg-green-400" />
              <TotemButton onClick={resetFlow} aria-label="Iniciar novo check-in">
                Novo Check-in
              </TotemButton>
            </TotemCard>
          )}

          {/* DUPLICATE — já registrado */}
          {step === "duplicate" && foundGuest && (
            <TotemCard variant="warning">
              <AlertCircle className="w-28 h-28 text-yellow-300 mx-auto" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-4xl font-bold text-yellow-200">{cfg.duplicateTitle}</p>
                <p className="text-3xl text-white">{foundGuest.name}</p>
              </div>
              <CountdownBar countdown={countdown} total={cfg.autoResetSeconds} color="bg-yellow-400" />
              <TotemButton onClick={resetFlow} aria-label="Iniciar novo check-in">
                Novo Check-in
              </TotemButton>
            </TotemCard>
          )}

          {/* NOT_FOUND — CPF não encontrado */}
          {step === "not_found" && (
            <TotemCard variant="error">
              <XCircle className="w-28 h-28 text-red-300 mx-auto" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-4xl font-bold text-red-200">{cfg.notFoundTitle}</p>
                <p className="text-2xl text-white/85">{cfg.notFoundMessage}</p>
              </div>
              <CountdownBar countdown={countdown} total={cfg.autoResetSeconds} color="bg-red-400" />
              <TotemButton onClick={resetFlow} aria-label="Tentar novamente">
                Tentar Novamente
              </TotemButton>
            </TotemCard>
          )}

          {/* ERROR — erro genérico */}
          {step === "error" && (
            <TotemCard variant="error">
              <XCircle className="w-28 h-28 text-red-300 mx-auto" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-4xl font-bold text-red-200">Ocorreu um erro</p>
                <p className="text-2xl text-white/85">
                  Não foi possível processar sua solicitação. Tente novamente.
                </p>
              </div>
              <CountdownBar countdown={countdown} total={cfg.autoResetSeconds} color="bg-red-400" />
              <TotemButton onClick={resetFlow} aria-label="Tentar novamente">
                Tentar Novamente
              </TotemButton>
            </TotemCard>
          )}

        </div>
      </main>

      <TotemStatsFooter totalCheckins={totalCheckins} />
    </div>
  );
}
