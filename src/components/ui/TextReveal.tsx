import { motion, type Variants } from "framer-motion";
import type { CSSProperties } from "react";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "words" | "chars";
  style?: CSSProperties;
};

const container: Variants = {
  hidden: {},
  show: (cfg: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: cfg.stagger,
      delayChildren: cfg.delay + 0.05,
    },
  }),
};

const item: Variants = {
  hidden: { y: "112%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Masked text reveal — each word (or character) slides up from behind
 * an overflow-hidden mask when the element enters the viewport.
 */
export default function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
  mode = "words",
  style,
}: TextRevealProps) {
  const units =
    mode === "chars"
      ? text.split("")
      : text.split(" ");

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={style}
      variants={container}
      custom={{ stagger, delay }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]"
        >
          <motion.span className="inline-block will-change-transform" variants={item}>
            {unit === " " ? "\u00A0" : unit}
            {mode === "words" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
