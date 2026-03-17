"use client";

import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { ErrorComponent } from "@/components/ui/error-components";
import { ConfigForm } from "@/features/config/components/config-form";
import { useSiteConfig } from "@/features/config/hooks";

export default function ConfigPage() {
  const { data, isLoading, isError } = useSiteConfig();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </header>
      {isLoading ? (
        <DefaultLoadingComponent />
      ) : isError ? (
        <ErrorComponent />
      ) : (
        <ConfigForm config={data?.data ?? null} />
      )}
    </div>
  );
}
