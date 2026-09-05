import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type AnimatedCounterProps = {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  compact?: boolean;
};

/**
 * Counts up to `to` when scrolled into view. If `to` changes afterwards
 * (live tickers, simulators) it smoothly animates from the previous value.
 */
export default function AnimatedCounter({
  to,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  compact = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(current.current, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const formatted = compact
    ? new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: decimals,
        minimumFractionDigits: 0,
      }).format(display)
    : new Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(display);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
