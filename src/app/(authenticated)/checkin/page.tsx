"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMyEvents } from "@/features/events/hooks";
import { usePublicSiteConfig } from "@/features/config/hooks";
import { CustomLoadingComponent } from "@/components/ui/loading-comp";
import { CalendarDays } from "lucide-react";
import { TotemEventCard } from "@/features/checkins/components/totem-event-card";

export default function CheckinSelectorPage() {
  const router = useRouter();
  const { data, isPending } = useMyEvents();
  const { data: configData } = usePublicSiteConfig();
  const events = data?.data ?? [];
  const loadingImageSrc = configData?.data.loadingImageUrl ?? undefined;

  useEffect(() => {
    if (!isPending && events.length === 1) {
      router.replace(`/checkin/${events[0].slug}`);
    }
  }, [isPending, events, router]);

  if (isPending) return <CustomLoadingComponent imageSrc={loadingImageSrc} />;

  if (events.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-8">
        <div
          className="text-center text-white space-y-6 border-2 border-white/25 p-12 rounded-3xl bg-black/30 backdrop-blur-md w-full max-w-2xl"
          role="status"
          aria-live="polite"
        >
          <CalendarDays className="w-40 h-40 mx-auto opacity-60" aria-hidden="true" />
          <p className="text-5xl font-bold">Nenhum evento disponível</p>
          <p className="text-2xl opacity-80">
            Você não está atribuído a nenhum evento no momento.
          </p>
        </div>
      </div>
    );
  }

  if (events.length === 1) {
    return <CustomLoadingComponent imageSrc={loadingImageSrc} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-10 p-8">
      <div className="text-center text-white space-y-3">
        <CalendarDays className="w-16 h-16 mx-auto opacity-80" aria-hidden="true" />
        <h1 className="text-5xl font-bold">Selecione o Evento</h1>
        <p className="text-2xl opacity-70">Toque no evento para realizar o check-in</p>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-2xl">
        {events.map((event) => (
          <TotemEventCard
            key={event.slug}
            name={event.name}
            startDate={event.startDate}
            endDate={event.endDate}
            onClick={() => router.push(`/checkin/${event.slug}`)}
          />
        ))}
      </div>
    </div>
  );
}
