import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import TextReveal from "../components/ui/TextReveal";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import HolographicCard from "../components/ui/HolographicCard";

/* ---------------------------------- data ---------------------------------- */

const TREASURY = [
  { asset: "Stablecoins", value: 940, pct: 45, color: "#00F0FF" },
  { asset: "Native AETH", value: 630, pct: 30, color: "#7B2CBF" },
  { asset: "ETH", value: 315, pct: 15, color: "#A86AE0" },
  { asset: "BTC & Blue-chip", value: 210, pct: 10, color: "#F5B74E" },
];

type Proposal = {
  id: string;
  title: string;
  status: "Voting" | "Active" | "Queued" | "Executed";
  for: number;
  against: number;
  abstain: number;
  endsAt: number;
  proposer: string;
  abstract: string;
};

const NOW = Date.now();
const h = 3_600_000;

const PROPOSALS: Proposal[] = [
  {
    id: "AIP-147",
    title: "Route 2% of sequencer fees to public goods funding",
    status: "Voting",
    for: 41_200_000,
    against: 12_800_000,
    abstain: 3_100_000,
    endsAt: NOW + 61 * h,
    proposer: "0x8f3a…c21d",
    abstract: "Redirects 2% of pooled sequencer revenue into a grants stream for public goods: client diversity, ZK tooling, and educational infrastructure. Funds are disbursed monthly by the elected Grants Council under a 3-of-5 multisig with on-chain reporting.",
  },
  {
    id: "AIP-146",
    title: "Increase Prism DA block size ceiling to 4MB",
    status: "Active",
    for: 28_900_000,
    against: 19_400_000,
    abstain: 6_200_000,
    endsAt: NOW + 118 * h,
    proposer: "0x2b77…90fe",
    abstract: "Raises the Prism data availability ceiling from 2MB to 4MB per block, doubling L2 throughput headroom. Sampling security analysis shows light-client verification cost rises by less than 6% at the new ceiling.",
  },
  {
    id: "AIP-145",
    title: "Establish Aetheris Grants Council — Q3 cohort",
    status: "Queued",
    for: 51_700_000,
    against: 7_300_000,
    abstain: 2_100_000,
    endsAt: NOW + 26 * h,
    proposer: "0xd410…77ab",
    abstract: "Elects five council members to administer the Q3 grants cohort (budget: 4.5M AETH). Council seats rotate every quarter; incumbents may serve a maximum of two consecutive terms.",
  },
  {
    id: "AIP-144",
    title: "Reduce validator minimum stake from 32k to 24k AETH",
    status: "Voting",
    for: 22_100_000,
    against: 24_600_000,
    abstain: 8_800_000,
    endsAt: NOW + 14 * h,
    proposer: "0x91ce…4402",
    abstract: "Lowers the validator entry threshold to broaden the active set from 1,240 toward 1,600 nodes. Simulation data from testnet shows Nakamoto coefficient improves from 17 to 21 with no measurable liveness impact.",
  },
  {
    id: "AIP-143",
    title: "Treasury diversification: 5% into short-duration T-bills",
    status: "Executed",
    for: 58_300_000,
    against: 9_100_000,
    abstain: 4_400_000,
    endsAt: NOW - 200 * h,
    proposer: "0x3fe2…b8c1",
    abstract: "Authorized the treasury to allocate up to 5% of stablecoin holdings into tokenized short-duration T-bills via two independent, audited wrappers. Execution completed; yield accrues to the treasury weekly.",
  },
];

const STATUS_COLOR: Record<Proposal["status"], string> = {
  Voting: "#00F0FF",
  Active: "#A86AE0",
  Queued: "#94A3B8",
  Executed: "#F5B74E",
};

const USER_WEIGHT = 12_480;

function formatRemaining(ms: number) {
  if (ms <= 0) return "ENDED";
  const d = Math.floor(ms / 86_400_000);
  const hh = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${d}d ${String(hh).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

/* -------------------------------- proposal row ----------------------------- */

function ProposalRow({ p, open, onToggle }: { p: Proposal; open: boolean; onToggle: () => void }) {
  const [vote, setVote] = useState<"for" | "against" | null>(null);
  const forW = p.for + (vote === "for" ? USER_WEIGHT : 0);
  const againstW = p.against + (vote === "against" ? USER_WEIGHT : 0);
  const total = forW + againstW + p.abstain;
  const color = STATUS_COLOR[p.status];
  const live = p.status === "Voting" || p.status === "Active";
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${open ? "border-white/15 bg-white/[0.04]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-5 px-5 py-5 text-left md:px-7">
        <span className="font-mono text-xs text-faint">{p.id}</span>
        <span
          className="rounded border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]"
          style={{ color, borderColor: `${color}44`, background: `${color}0d` }}
        >
          {p.status}
        </span>
        <span className="flex-1 truncate text-sm font-semibold text-holo md:text-base">{p.title}</span>
        {live && (
          <span className="hidden font-mono text-[11px] text-cyber sm:block">{formatRemaining(p.endsAt - now)}</span>
        )}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="text-xl text-dim">
          +
        </motion.span>
      </button>

      {/* vote bar (always visible) */}
      <div className="px-5 pb-4 md:px-7">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div className="h-full bg-cyber" initial={{ width: 0 }} whileInView={{ width: `${(forW / total) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
          <motion.div className="h-full bg-plasma" initial={{ width: 0 }} whileInView={{ width: `${(againstW / total) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-faint">
          <span>FOR <span className="text-cyber">{((forW / total) * 100).toFixed(1)}%</span></span>
          <span>AGAINST <span className="text-plasma-soft">{((againstW / total) * 100).toFixed(1)}%</span></span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-t border-white/[0.07] px-5 py-6 md:grid-cols-[1.6fr_1fr] md:px-7">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">Abstract</p>
                <p className="mt-3 text-sm leading-relaxed text-dim">{p.abstract}</p>
                <p className="mt-5 font-mono text-[11px] text-faint">
                  PROPOSED BY <span className="text-cyber">{p.proposer}</span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { l: "FOR", v: forW, c: "#00F0FF" },
                    { l: "AGAINST", v: againstW, c: "#A86AE0" },
                    { l: "ABSTAIN", v: p.abstain, c: "#94A3B8" },
                  ].map((x) => (
                    <div key={x.l} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{x.l}</p>
                      <p className="mt-1.5 font-mono text-sm" style={{ color: x.c }}>
                        {(x.v / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Quorum · 4% (40M AETH)</p>
                {live ? (
                  vote ? (
                    <p className="rounded-lg border border-cyber/30 bg-cyber/[0.06] px-4 py-3 text-center font-mono text-xs text-cyber">
                      ✓ Vote recorded — {USER_WEIGHT.toLocaleString()} AETH cast {vote.toUpperCase()}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setVote("for")} className="rounded-lg border border-cyber/40 bg-cyber/[0.08] px-4 py-2.5 font-mono text-xs text-cyber transition-all duration-300 hover:bg-cyber/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                        Vote FOR
                      </button>
                      <button onClick={() => setVote("against")} className="rounded-lg border border-plasma-soft/40 bg-plasma/[0.1] px-4 py-2.5 font-mono text-xs text-plasma-soft transition-all duration-300 hover:bg-plasma/25">
                        Vote AGAINST
                      </button>
                    </div>
                  )
                ) : (
                  <p className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-center font-mono text-xs text-faint">
                    Voting closed · final tally on-chain
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- page ----------------------------------- */

export default function Governance() {
  const [openId, setOpenId] = useState<string | null>("AIP-147");

  return (
    <main>
      <PageHeader
        index="05"
        overline="Governance · On-Chain"
        title="Power, rotated."
        lede="Every parameter of the protocol — fees, ceilings, treasury movements — is changeable only by AETH holders through the AIP process. Proposals are public, votes are on-chain, and execution is timelocked. Watch it move."
        meta={["QUORUM 4%", "TIMELOCK 72H", "142 AIPS PASSED"]}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* stat chips */}
        <div className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {[
            { v: 142, suffix: "", label: "AIPs passed" },
            { v: 3218, suffix: "", label: "Delegates" },
            { v: 61, suffix: "%", label: "Avg. turnout" },
            { v: 2.09, suffix: "B", prefix: "$", decimals: 2, label: "Treasury" },
          ].map((s, i) => (
            <div key={i} className="group bg-void px-6 py-7 transition-colors duration-300 hover:bg-white/[0.03]">
              <p className="font-mono text-2xl text-holo transition-colors duration-300 group-hover:text-cyber">
                <AnimatedCounter to={s.v} prefix={s.prefix ?? ""} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-faint">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
          {/* treasury */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Treasury · $2.09B</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.02] tracking-tight text-holo md:text-4xl">
              <TextReveal text="The vault, itemized." />
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-dim">
              Treasury composition, marked to market daily. Movements require
              an AIP, a 72-hour timelock, and survive a public objection window.
            </p>
            <div className="mt-8 space-y-6">
              {TREASURY.map((t, i) => (
                <div key={t.asset} className="group">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-holo transition-colors duration-300 group-hover:text-cyber">{t.asset}</span>
                    <span className="font-mono text-sm text-dim">
                      <AnimatedCounter to={t.value} prefix="$" suffix="M" />
                      <span className="ml-2 text-[10px] text-faint">{t.pct}%</span>
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${t.color}88, ${t.color})`, boxShadow: `0 0 14px ${t.color}55` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: true, margin: "-5% 0px" }}
                      transition={{ duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* process timeline */}
            <div className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">AIP lifecycle</p>
              <div className="mt-5 flex items-center gap-0">
                {["Draft", "Temp. check", "Vote", "Timelock", "Execute"].map((s, i) => (
                  <div key={s} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <span className={`h-2.5 w-2.5 rounded-full ${i === 2 ? "bg-cyber shadow-[0_0_12px_rgba(0,240,255,0.7)]" : "bg-white/20"}`} />
                      <span className={`mt-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] ${i === 2 ? "text-cyber" : "text-faint"}`}>{s}</span>
                    </div>
                    {i < 4 && <span className="mx-1 mb-5 h-px flex-1 bg-white/10" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* proposals */}
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Active proposals</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-holo md:text-4xl">
                  <TextReveal text="The floor is open." />
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyber" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Your weight · {USER_WEIGHT.toLocaleString()} AETH</span>
              </div>
            </div>
            <div className="space-y-3">
              {PROPOSALS.map((p) => (
                <ProposalRow key={p.id} p={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
