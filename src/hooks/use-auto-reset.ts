"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Conta regressivamente de `seconds` até 0 enquanto `active` for true,
 * então chama `onReset`. Retorna o tempo restante para exibição na UI.
 *
 * - Seguro para regras dos hooks: sempre chamado incondicionalmente.
 * - Usa ref para garantir que a versão mais recente de `onReset` seja
 *   chamada, mesmo que a referência da função mude entre renders.
 */
export function useAutoReset(
  active: boolean,
  onReset: () => void,
  seconds: number,
): number {
  const [remaining, setRemaining] = useState(seconds);
  const onResetRef = useRef(onReset);

  // Mantém a ref sempre atualizada sem disparar o efeito principal
  useEffect(() => {
    onResetRef.current = onReset;
  });

  useEffect(() => {
    if (!active) {
      setRemaining(seconds);
      return;
    }

    setRemaining(seconds);

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onResetRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, seconds]);

  return remaining;
}
