import { useEffect } from "react";

export function Confetti() {
  useEffect(() => {
    // no-op, pure CSS confetti
  }, []);
  const pieces = Array.from({ length: 60 });
  const colors = ["#1D9E75", "#0F6E56", "#FBBF24", "#3B82F6", "#A855F7", "#EF4444"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 2 + Math.random() * 2;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `-20px`,
              width: size,
              height: size * 1.4,
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            className="absolute rounded-sm [animation:confetti_3s_ease-out_forwards]"
          />
        );
      })}
    </div>
  );
}
