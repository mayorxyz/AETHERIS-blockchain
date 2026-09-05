import TextReveal from "./ui/TextReveal";
import { motion } from "framer-motion";

type PageHeaderProps = {
  index: string;
  overline: string;
  title: string;
  lede: string;
  meta?: string[];
};

export default function PageHeader({ index, overline, title, lede, meta }: PageHeaderProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pt-44">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4"
      >
        <span className="font-mono text-xs tracking-[0.25em] text-cyber">/{index}</span>
        <span className="h-px w-16 bg-gradient-to-r from-cyber/70 to-transparent" />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">{overline}</span>
      </motion.div>

      <h1 className="mt-7 font-display text-[13vw] font-semibold leading-[0.95] tracking-tight text-holo sm:text-6xl lg:text-7xl">
        <TextReveal text={title} stagger={0.06} />
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-xl text-base leading-relaxed text-dim md:text-lg"
        >
          {lede}
        </motion.p>
        {meta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap items-start gap-x-8 gap-y-2 lg:justify-end"
          >
            {meta.map((m) => (
              <span key={m} className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                {m}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
