import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import PageHeader from "../components/PageHeader";
import TextReveal from "../components/ui/TextReveal";
import HolographicCard from "../components/ui/HolographicCard";
import AnimatedCounter from "../components/ui/AnimatedCounter";

/* ---------------------------------- data ---------------------------------- */

type Category = "DeFi" | "Gaming" | "Infrastructure" | "NFT";

const CATS: { name: Category | "All"; color: string }[] = [
  { name: "All", color: "#E2E8F0" },
  { name: "DeFi", color: "#00F0FF" },
  { name: "Gaming", color: "#A86AE0" },
  { name: "Infrastructure", color: "#94A3B8" },
  { name: "NFT", color: "#F5B74E" },
];

const catColor = (c: Category) => CATS.find((x) => x.name === c)!.color;

const DAPPS: { name: string; cat: Category; tag: string; metricLabel: string; metric: string }[] = [
  { name: "Nebula Swap", cat: "DeFi", tag: "On-chain order book with parallel matching — 12k orders cleared per second.", metricLabel: "TVL", metric: "$1.2B" },
  { name: "Aetherlend", cat: "DeFi", tag: "Money markets with ZK-verified credit delegation across 14 asset classes.", metricLabel: "TVL", metric: "$840M" },
  { name: "Voidrunners", cat: "Gaming", tag: "Fully on-chain RPG. Every item, every battle, settled on Aetheris.", metricLabel: "DAILY USERS", metric: "52k" },
  { name: "PrismLink", cat: "Infrastructure", tag: "Omnichain messaging secured by Aetheris ZK proofs. 31 chains connected.", metricLabel: "CHAINS", metric: "31" },
  { name: "ChainForge", cat: "Infrastructure", tag: "Sub-12ms indexed queries over the full chain, served at the edge.", metricLabel: "INDEX LATENCY", metric: "12ms" },
  { name: "Orbital Pay", cat: "DeFi", tag: "Merchant settlement rails with 0.4-second finality at the point of sale.", metricLabel: "MONTHLY VOL", metric: "$210M" },
  { name: "Monolith", cat: "NFT", tag: "Generative art protocol — artworks minted from on-chain entropy.", metricLabel: "MINTED", metric: "1.4M" },
  { name: "Hexlabs", cat: "Infrastructure", tag: "Formal verification and ZK circuit auditing for Aetheris contracts.", metricLabel: "AUDITS", metric: "340+" },
  { name: "Stardust Arena", cat: "Gaming", tag: "On-chain esports league with transparent, verifiable prize pools.", metricLabel: "PRIZE POOL", metric: "$4.8M" },
  { name: "Vaultic", cat: "DeFi", tag: "Structured yield vaults built on Aetheris sequencing revenue.", metricLabel: "TVL", metric: "$310M" },
];

const FILTERS = CATS.map((c) => c.name);

/* --------------------------------- monogram -------------------------------- */

function Monogram({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <path d="M22 3l16 9v18l-16 9-16-9V12z" fill="none" stroke={color} strokeWidth="1.3" opacity="0.75" />
      <path d="M22 10l10 5.6v11.2L22 32.4 12 26.8V15.6z" fill={`${color}14`} stroke={color} strokeWidth="0.8" opacity="0.5" />
      <text x="22" y="26.5" textAnchor="middle" fill={color} fontSize="11" fontFamily="Clash Display" fontWeight="600">
        {initials}
      </text>
    </svg>
  );
}

/* ---------------------------------- page ----------------------------------- */

export default function Ecosystem() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = DAPPS.filter((d) => filter === "All" || d.cat === filter);

  return (
    <main>
      <PageHeader
        index="03"
        overline="Ecosystem · 128 Protocols"
        title="Built on Aetheris."
        lede="From order books clearing twelve thousand trades a second to fully on-chain worlds — an economy is compounding on the layer. Filter the field, hover a card, read the numbers."
        meta={["128 PROTOCOLS", "$4.2B TVL", "31 BRIDGED CHAINS"]}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* stat strip */}
        <div className="mb-10 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
          {[
            { v: 128, suffix: "", label: "Protocols live" },
            { v: 4.2, suffix: "B", prefix: "$", decimals: 1, label: "Value locked" },
            { v: 1.9, suffix: "M", decimals: 1, label: "Weekly transactions" },
          ].map((s, i) => (
            <div key={i} className="group min-w-0 bg-void px-3 py-6 transition-colors duration-300 hover:bg-white/[0.03] sm:px-6">
              <p className="font-mono text-xl text-holo transition-colors duration-300 group-hover:text-cyber md:text-2xl">
                <AnimatedCounter to={s.v} prefix={s.prefix ?? ""} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-faint">{s.label}</p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const color = CATS.find((c) => c.name === f)!.color;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  active ? "border-transparent text-void" : "border-white/12 text-dim hover:border-white/30 hover:text-holo"
                }`}
                style={active ? { color: "#030305" } : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: color, boxShadow: `0 0 24px ${color}55` }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {f}
                  <span className={`font-mono text-[10px] ${active ? "opacity-60" : "text-faint"}`}>
                    {f === "All" ? DAPPS.length : DAPPS.filter((d) => d.cat === f).length}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* grid */}
        <LayoutGroup>
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((d, i) => {
                const color = catColor(d.cat);
                return (
                  <motion.div
                    layout
                    key={d.name}
                    initial={{ opacity: 0, scale: 0.92, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 16 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
                  >
                    <HolographicCard className="group relative h-full cursor-default overflow-hidden p-6 max-md:pb-24 transition-transform duration-300 hover:-translate-y-1.5">
                      <div className="flex items-start justify-between">
                        <Monogram name={d.name} color={color} />
                        <span
                          className="rounded border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]"
                          style={{ color, borderColor: `${color}44`, background: `${color}0d` }}
                        >
                          {d.cat}
                        </span>
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-holo transition-colors duration-300 group-hover:text-cyber">
                        {d.name}
                      </h3>
                      <p className="mt-2.5 min-h-[3.5rem] text-sm leading-relaxed text-dim">{d.tag}</p>

                      {/* hover metric drawer — always visible on touch/mobile */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 max-md:translate-y-0">
                        <div className="flex items-end justify-between border-t px-6 py-4 backdrop-blur-xl" style={{ borderColor: `${color}33`, background: "rgba(3,3,5,0.85)" }}>
                          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">{d.metricLabel}</span>
                          <span className="font-mono text-xl font-medium" style={{ color, textShadow: `0 0 18px ${color}66` }}>
                            {d.metric}
                          </span>
                        </div>
                      </div>
                    </HolographicCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* spotlight */}
        <div className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Spotlight</p>
          <HolographicCard className="mt-6 overflow-hidden">
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3">
                  <Monogram name="PrismLink" color="#94A3B8" />
                  <span className="rounded border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                    Infrastructure
                  </span>
                </div>
                <h3 className="mt-7 font-display text-3xl font-semibold tracking-tight text-holo md:text-5xl">
                  <TextReveal text="PrismLink speaks 31 languages." />
                </h3>
                <p className="mt-5 max-w-xl leading-relaxed text-dim">
                  The omnichain messaging layer secured by Aetheris ZK proofs.
                  When a message crosses from Aetheris to any of 31 connected
                  chains, its validity is not assumed — it is mathematically
                  proven, in 40 milliseconds, before it ever lands.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["ZK-SECURED", "31 CHAINS", "180ms CROSS-CHAIN", "$2.1B MOVED"].map((s) => (
                    <span key={s} className="rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-dim">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px border-t border-white/[0.07] bg-white/[0.07] lg:border-l lg:border-t-0">
                {[
                  { v: "$2.1B", l: "Total bridged" },
                  { v: "6.4M", l: "Messages passed" },
                  { v: "180ms", l: "Median latency" },
                  { v: "0", l: "Exploits, ever" },
                ].map((s) => (
                  <div key={s.l} className="group bg-void p-7 transition-colors duration-300 hover:bg-white/[0.03]">
                    <p className="font-mono text-2xl text-holo transition-colors duration-300 group-hover:text-cyber">{s.v}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-faint">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </HolographicCard>
        </div>
      </section>
    </main>
  );
}
