import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import NetworkMesh from "../components/NetworkMesh";
import TextReveal from "../components/ui/TextReveal";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import HolographicCard from "../components/ui/HolographicCard";

/* ---------------------------------- data ---------------------------------- */

const SLABS = [
  {
    index: "01",
    layer: "EXECUTION",
    name: "Hypergrid Engine",
    copy: "A parallel EVM that schedules independent transactions across 32 concurrent lanes before execution. Conflicting state accesses are detected statically — everything else runs simultaneously.",
    specs: ["100k TPS", "32 LANES", "SOLIDITY-NATIVE"],
  },
  {
    index: "02",
    layer: "CONSENSUS",
    name: "Pulse BFT",
    copy: "A pipelined Byzantine fault-tolerant protocol with 0.4-second finality. Validators attest in rotating shards, so liveness never depends on a single committee.",
    specs: ["0.4s FINALITY", "⅓ FAULT TOLERANT", "1,240 VALIDATORS"],
  },
  {
    index: "03",
    layer: "DATA AVAILABILITY",
    name: "Prism DA",
    copy: "Erasure-coded data availability sampling with KZG commitments. Light clients verify block availability by downloading less than 1% of the data.",
    specs: ["2MB BLOCKS", "KZG COMMITMENTS", "<1% SAMPLING"],
  },
  {
    index: "04",
    layer: "SETTLEMENT",
    name: "ZK Attestation",
    copy: "Every epoch is compressed into a single 288-byte recursive SNARK. Any device — a phone, a browser — can verify the entire chain in 40 milliseconds.",
    specs: ["288B PROOF", "40ms VERIFY", "RECURSIVE"],
  },
];

const PARTNERS = [
  "NEBULA SWAP",
  "AETHERLEND",
  "PRISMLINK",
  "VOIDRUNNERS",
  "CHAINFORGE",
  "MONOLITH",
  "ORBITAL PAY",
  "HEXLABS",
  "VAULTIC",
  "STARDUST ARENA",
];

const VALIDATORS = ["pulse-val-04", "prism-node-12", "aeth-stake-77", "void-val-19", "core-node-31"];

function randomHash() {
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 6; i++) h += hex[Math.floor(Math.random() * 16)];
  h += "…";
  for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}

type Block = { height: number; hash: string; txns: number; validator: string };

function makeBlock(height: number): Block {
  return {
    height,
    hash: randomHash(),
    txns: 820 + Math.floor(Math.random() * 640),
    validator: VALIDATORS[Math.floor(Math.random() * VALIDATORS.length)],
  };
}

/* ------------------------------ manifesto word ----------------------------- */

function ManifestoWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

/* --------------------------------- sections -------------------------------- */

function Hero() {
  const [blockHeight, setBlockHeight] = useState(18_442_091);

  useEffect(() => {
    const id = setInterval(() => setBlockHeight((h) => h + 4 + Math.floor(Math.random() * 4)), 2000);
    return () => clearInterval(id);
  }, []);

  return (
  <section className="relative flex min-h-[100svh] w-full max-w-full flex-col justify-center overflow-x-hidden min-w-0">
    <NetworkMesh />
    <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-full max-w-[880px] -translate-x-1/2 rounded-full bg-plasma/15 blur-[140px]" />
    <div className="pointer-events-none absolute bottom-[-200px] right-[-120px] h-[420px] w-full max-w-[420px] rounded-full bg-cyber/[0.06] blur-[120px]" />

    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 md:px-8 min-w-0">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex flex-wrap items-center gap-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-dim"
      >
        <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-cyber" />
        <span>Aetheris Protocol · L1 · Mainnet Genesis 2024</span>
      </motion.p>

      <h1 className="mt-6 sm:mt-8 font-display text-[clamp(1.65rem,8.5vw,8rem)] font-semibold leading-[0.92] tracking-[-0.01em] text-holo">
        <TextReveal text="THE FOUNDATIONAL" mode="chars" stagger={0.022} className="block whitespace-nowrap" />
        <TextReveal text="LAYER FOR THE" mode="chars" stagger={0.022} delay={0.25} className="block whitespace-nowrap" />
        <span className="block text-cyber" style={{ textShadow: "0 0 44px rgba(255, 30, 0, 0)" }}>
          <TextReveal text="NEXT INTERNET." mode="chars" stagger={0.022} delay={0.5} className="whitespace-nowrap" />
        </span>
      </h1>

      <div className="mt-8 sm:mt-10 grid items-end gap-8 lg:gap-10 lg:grid-cols-[1.1fr_1fr] min-w-0">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-lg text-sm sm:text-base leading-relaxed text-dim md:text-lg min-w-0"
        >
          A Layer 1 engineered for parallel execution, zero knowledge settlement and decentralized sequencing,
          one hundred thousand transactions per second, without asking validators to compromise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 lg:justify-end min-w-0"
        >
          <Link
            to="/technology"
            className="holo group flex min-h-[44px] items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold text-holo transition-all duration-300 hover:text-cyber"
          >
            Explore the stack
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </Link>
          <Link
            to="/developers"
            className="group flex min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-cyber transition-colors hover:text-holo"
          >
            <span className="font-mono text-xs">$</span> Build on Aetheris
          </Link>
        </motion.div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="relative z-10 mx-auto mt-12 flex w-full max-w-7xl items-end justify-between px-4 sm:px-6 md:px-8 pb-8 md:mt-16 min-w-0"
    >
      <div className="flex items-center gap-3 text-faint min-w-0">
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px bg-gradient-to-b from-cyber to-transparent shrink-0"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] truncate">Scroll to descend</span>
      </div>
      <div className="hidden text-right font-mono text-[11px] leading-relaxed text-faint sm:block tabular-nums">
        <p>
          BLOCK{" "}
          <span className="text-cyber">
            #<AnimatedCounter to={blockHeight} duration={0.8} />
          </span>
        </p>
        <p>CONSENSUS · PULSE-BFT</p>
        <p>FINALITY · 0.4s</p>
      </div>
    </motion.div>
  </section>
);
}

function StatsBand() {
  const [stats, setStats] = useState({ tps: 98_412, tvl: 4.21, nodes: 1_240, blocks: 18_442_091 });

  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => ({
        tps: s.tps + Math.floor(Math.random() * 160 - 60),
        tvl: +(s.tvl + (Math.random() * 0.008 - 0.002)).toFixed(3),
        nodes: s.nodes + (Math.random() > 0.7 ? 1 : 0),
        blocks: s.blocks + 4 + Math.floor(Math.random() * 3),
      }));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "THROUGHPUT", node: <AnimatedCounter to={stats.tps} duration={1.2} suffix=" TPS" /> },
    {
      label: "TOTAL VALUE LOCKED",
      node: <AnimatedCounter to={stats.tvl} decimals={2} prefix="$" suffix="B" duration={1.2} />,
    },
    { label: "ACTIVE NODES", node: <AnimatedCounter to={stats.nodes} duration={1.2} /> },
    { label: "BLOCK HEIGHT", node: <AnimatedCounter to={stats.blocks} duration={1.2} /> },
  ];

  return (
    <section className="relative z-10 mx-auto -mt-2 w-full max-w-7xl px-4 sm:px-6 md:px-8 min-w-0">
      <div className="holo grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] rounded-2xl overflow-hidden min-w-0">
        {items.map((it, i) => (
          <div
            key={it.label}
            className="group px-4 py-5 transition-colors duration-300 hover:bg-white/[0.03] sm:px-6 sm:py-7 min-w-0"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint truncate">{it.label}</p>
            <p className="mt-2 font-mono text-lg sm:text-xl md:text-2xl font-medium text-holo transition-colors duration-300 group-hover:text-cyber tabular-nums truncate">
              {it.node}
            </p>
            <span className="mt-3 block h-px w-8 bg-cyber/40 transition-all duration-500 group-hover:w-full group-hover:bg-cyber" />
            <span className="sr-only">{i}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 2", "end 2"] });
  const text =
    "Scalability without compromise. Security without centralization. The next internet will not run on borrowed throughput it will be settled by infrastructure engineered like precision machinery.";
  const words = text.split(" ");

  return (
    <section ref={ref} className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-32 lg:py-44 min-w-0">
      <p className="mb-6 sm:mb-8 md:mb-10 font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Manifesto</p>
      <p className="max-w-5xl font-display text-xl sm:text-3xl md:text-4xl lg:text-[3.4rem] font-semibold leading-[1.15] tracking-tight text-holo break-words">
        {words.map((w, i) => (
          <ManifestoWord
            key={i}
            word={w}
            range={[i / words.length, Math.min(1, (i + 1.6) / words.length)]}
            progress={scrollYProgress}
          />
        ))}
      </p>
    </section>
  );
}

function StackAnatomy() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 py-16 md:py-20 min-w-0">
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1fr_1.6fr] min-w-0">
        <div className="lg:sticky lg:top-32 lg:self-start min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Architecture</p>
          <h2 className="mt-4 sm:mt-5 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.02] tracking-tight text-holo">
            <TextReveal text="Anatomy of the stack." />
          </h2>
          <p className="mt-4 sm:mt-6 max-w-sm text-sm sm:text-base leading-relaxed text-dim">
            Four subsystems, one coherent machine. Each layer is designed so the one above it never becomes its
            bottleneck.
          </p>
          <Link
            to="/technology"
            className="group mt-6 sm:mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyber transition-colors hover:text-holo"
          >
            Read the deep dive
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </Link>
        </div>

        <div className="space-y-4 min-w-0">
          {SLABS.map((s, i) => (
            <motion.div
              key={s.index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0"
            >
              <HolographicCard className="group cursor-default p-4 sm:p-6 md:p-7 lg:p-8 transition-all duration-300 hover:-translate-y-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 min-w-0">
                  <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                    <span className="font-mono text-xs text-cyber shrink-0">{s.index}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint truncate">
                      {s.layer}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-holo transition-colors duration-300 group-hover:text-cyber truncate">
                    {s.name}
                  </h3>
                </div>
                <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-dim">{s.copy}</p>
                <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 min-w-0">
                  {s.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-dim transition-colors duration-300 group-hover:border-cyber/30 group-hover:text-cyber whitespace-nowrap"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlockFeed() {
  const [blocks, setBlocks] = useState<Block[]>(() =>
    Array.from({ length: 6 }, (_, i) => makeBlock(18_442_091 - i)).sort((a, b) => b.height - a.height)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setBlocks((prev) => [makeBlock(prev[0].height + 1), ...prev].slice(0, 6));
    }, 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 py-16 md:py-20 min-w-0">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 min-w-0">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Live chain</p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-holo">
            <TextReveal text="The chain, breathing." />
          </h2>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="live-dot h-2 w-2 rounded-full bg-cyber" />
          <span className="font-mono text-xs text-dim">STREAMING · 0.4s BLOCKS</span>
        </div>
      </div>

      <div className="holo overflow-hidden rounded-2xl w-full min-w-0">
        {/* Rigid Grid Container for stable alignment */}
        <div className="grid grid-cols-2 md:grid-cols-[1.1fr_1.3fr_0.7fr_1fr] gap-4 border-b border-white/[0.07] px-4 py-3 md:px-6 md:py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-faint min-w-0">
          <span>Height</span>
          <span className="hidden md:block">Hash</span>
          <span className="text-right">Txns</span>
          <span className="hidden md:block">Validator</span>
        </div>

        {/* Height-constrained scrollable block feed to stop structural layout shaking */}
        <div className="relative min-w-0 overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {blocks.map((b) => (
              <motion.div
                key={b.height}
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 md:grid-cols-[1.1fr_1.3fr_0.7fr_1fr] gap-4 border-b border-white/[0.04] px-4 py-3 md:px-6 md:py-3.5 font-mono text-xs last:border-0 items-center min-w-0 overflow-hidden"
              >
                <span className="text-cyber tabular-nums truncate">#{b.height.toLocaleString()}</span>
                <span className="hidden text-dim md:block truncate font-mono">{b.hash}</span>
                <span className="text-right text-holo tabular-nums truncate">{b.txns.toLocaleString()}</span>
                <span className="hidden text-dim md:block truncate font-mono">{b.validator}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section
      aria-label="Aetheris ecosystem partners"
      className="marquee relative z-10 w-full max-w-full overflow-hidden border-y border-white/[0.06] py-6 sm:py-8 md:py-10 min-w-0"
    >
      <div aria-hidden="true" className="marquee-track flex items-center gap-8 pr-8 md:gap-14 md:pr-14 min-w-0">
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-14 shrink-0">
            <span className="cursor-default whitespace-nowrap font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-faint transition-all duration-300 hover:text-cyber hover:[text-shadow:0_0_28px_rgba(0,240,255,0.45)]">
              {p}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 text-plasma-soft/50">
              <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 lg:py-32 min-w-0">
      <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.7fr_1fr] min-w-0">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight text-holo break-words">
          <TextReveal text="Build on the layer" />{" "}
          <span className="text-cyber" style={{ textShadow: "0 0 40px rgba(0,240,255,0.3)" }}>
            <TextReveal text="that never blinks." delay={0.25} />
          </span>
        </h2>
        <div className="flex flex-col items-start gap-4 lg:items-end min-w-0">
          <Link
            to="/developers"
            className="holo group flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-3 rounded-xl px-7 py-4 text-sm font-semibold text-holo transition-colors duration-300 hover:text-cyber"
          >
            Start building
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </Link>
          <Link to="/governance" className="text-sm font-medium text-dim transition-colors hover:text-holo">
            Join governance →
          </Link>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            No roadmap promises. Shipped infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden min-w-0 bg-black text-white">
      <Hero />
      <StatsBand />
      <Manifesto />
      <StackAnatomy />
      <BlockFeed />
      <Marquee />
      <CTABand />
    </main>
  );
}