"use client";

interface CountdownBarProps {
  countdown: number;
  total: number;
  /** Classe Tailwind de cor do fill — ex: "bg-green-400", "bg-yellow-400", "bg-red-400" */
  color: string;
}

export function CountdownBar({ countdown, total, color }: CountdownBarProps) {
  return (
    <div className="space-y-2">
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${(countdown / total) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="text-xl text-white/80 text-center">
        Reiniciando em {countdown}s...
      </p>
    </div>
  );
}
