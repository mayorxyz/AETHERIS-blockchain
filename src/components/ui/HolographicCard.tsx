import { useRef, type ReactNode, type MouseEvent } from "react";

type HolographicCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * Frosted-glass surface with a rotating conic-gradient border on hover
 * and a cursor-following iridescent glare.
 */
export default function HolographicCard({
  children,
  className = "",
  onClick,
}: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onClick={onClick}
      className={`holo rounded-xl transition-transform duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
