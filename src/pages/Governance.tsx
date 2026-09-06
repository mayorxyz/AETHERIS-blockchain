import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import TextReveal from "../components/ui/TextReveal";
import AnimatedCounter from "../components/ui/AnimatedCounter";

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
    abstract:
      "Redirects 2% of pooled sequencer revenue into a grants stream for public goods: client diversity, ZK tooling, and educational infrastructure. Funds are disbursed monthly by the elected Grants Council under a 3-of-5 multisig with on-chain reporting.",
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
    abstract:
      "Raises the Prism data availability ceiling from 2MB to 4MB per block, doubling L2 throughput headroom. Sampling security analysis shows light-client verification cost rises by less than 6% at the new ceiling.",
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
    abstract:
      "Elects five council members to administer the Q3 grants cohort (budget: 4.5M AETH). Council seats rotate every quarter; incumbents may serve a maximum of two consecutive terms.",
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
    abstract:
      "Lowers the validator entry threshold to broaden the active set from 1,240 toward 1,600 nodes. Simulation data from testnet shows Nakamoto coefficient improves from 17 to 21 with no measurable liveness impact.",
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
    abstract:
      "Authorized the treasury to allocate up to 5% of stablecoin holdings into tokenized short-duration T-bills via two independent, audited wrappers. Execution completed; yield accrues to the treasury weekly.",
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
    <div
      className={`min-w-0 rounded-xl border transition-colors duration-300 ${
        open ? "border-white/15 bg-white/[0.04]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-2.5 p-3.5 text-left sm:items-center sm:gap-4 md:px-6 md:py-5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-mono text-[11px] text-faint sm:text-xs">{p.id}</span>
            <span
              className="rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]"
              style={{ color, borderColor: `${color}44`, background: `${color}0d` }}
            >
              {p.status}
            </span>
          </div>

          <span className="min-w-0 flex-1 break-words font-display text-xs font-semibold leading-snug text-holo sm:text-sm md:text-base">
            {p.title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-center">
          {live && (
            <span className="hidden font-mono text-[11px] text-cyber md:block">
              {formatRemaining(p.endsAt - now)}
            </span>
          )}
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="text-lg text-dim sm:text-xl">
            +
          </motion.span>
        </div>
      </button>

      {/* vote bar (always visible) */}
      <div className="px-3.5 pb-3.5 md:px-6">
        {live && (
          <p className="mb-2 font-mono text-[10px] text-cyber md:hidden">
            {formatRemaining(p.endsAt - now)}
          </p>
        )}
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full bg-cyber"
            initial={{ width: 0 }}
            whileInView={{ width: `${(forW / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="h-full bg-plasma"
            initial={{ width: 0 }}
            whileInView={{ width: `${(againstW / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-1 font-mono text-[10px] text-faint">
          <span>
            FOR <span className="text-cyber">{((forW / total) * 100).toFixed(1)}%</span>
          </span>
          <span>
            AGAINST <span className="text-plasma-soft">{((againstW / total) * 100).toFixed(1)}%</span>
          </span>
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
            <div className="grid gap-6 border-t border-white/[0.07] px-3.5 py-4 sm:p-6 md:grid-cols-[1.6fr_1fr] md:gap-8">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">Abstract</p>
                <p className="mt-2.5 break-words text-xs leading-relaxed text-dim sm:text-sm">{p.abstract}</p>
                <p className="mt-4 break-all font-mono text-[10px] text-faint sm:text-[11px]">
                  PROPOSED BY <span className="text-cyber">{p.proposer}</span>
                </p>
              </div>

              <div className="space-y-3 min-w-0">
                <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3 md:grid-cols-3">
                  {[
                    { l: "FOR", v: forW, c: "#00F0FF" },
                    { l: "AGAINST", v: againstW, c: "#A86AE0" },
                    { l: "ABSTAIN", v: p.abstain, c: "#94A3B8" },
                  ].map((x) => (
                    <div key={x.l} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{x.l}</p>
                      <p className="mt-1 font-mono text-xs sm:text-sm" style={{ color: x.c }}>
                        {(x.v / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                  ))}
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Quorum · 4% (40M AETH)</p>

                {live ? (
                  vote ? (
                    <p className="rounded-lg border border-cyber/30 bg-cyber/[0.06] px-3 py-2.5 text-center font-mono text-xs text-cyber">
                      ✓ Vote recorded — {USER_WEIGHT.toLocaleString()} AETH cast {vote.toUpperCase()}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        onClick={() => setVote("for")}
                        className="rounded-lg border border-cyber/40 bg-cyber/[0.08] px-3 py-2 font-mono text-xs text-cyber transition-all duration-300 hover:bg-cyber/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      >
                        Vote FOR
                      </button>
                      <button
                        onClick={() => setVote("against")}
                        className="rounded-lg border border-plasma-soft/40 bg-plasma/[0.1] px-3 py-2 font-mono text-xs text-plasma-soft transition-all duration-300 hover:bg-plasma/25"
                      >
                        Vote AGAINST
                      </button>
                    </div>
                  )
                ) : (
                  <p className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-center font-mono text-xs text-faint">
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
    <main className="w-full max-w-full overflow-x-hidden min-w-0">
      <PageHeader
        index="05"
        overline="Governance · On-Chain"
        title="Power, rotated."
        lede="Every parameter of the protocol — fees, ceilings, treasury movements — is changeable only by AETH holders through the AIP process. Proposals are public, votes are on-chain, and execution is timelocked. Watch it move."
        meta={["QUORUM 4%", "TIMELOCK 72H", "142 AIPS PASSED"]}
      />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 min-w-0 sm:px-6 lg:px-8">
        {/* stat chips */}
        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:mb-14 lg:grid-cols-4">
          {[
            { v: 142, suffix: "", label: "AIPs passed" },
            { v: 3218, suffix: "", label: "Delegates" },
            { v: 61, suffix: "%", label: "Avg. turnout" },
            { v: 2.09, suffix: "B", prefix: "$", decimals: 2, label: "Treasury" },
          ].map((s, i) => (
            <div key={i} className="group bg-void px-4 py-5 transition-colors duration-300 hover:bg-white/[0.03] sm:px-6 sm:py-7">
              <p className="font-mono text-xl text-holo transition-colors duration-300 group-hover:text-cyber sm:text-2xl">
                <AnimatedCounter to={s.v} prefix={s.prefix ?? ""} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-faint sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-10 min-w-0 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          {/* treasury */}
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:text-[11px] sm:tracking-[0.28em]">
              // Treasury · $2.09B
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-holo sm:text-3xl md:text-4xl">
              <TextReveal text="The vault, itemized." />
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-dim sm:mt-4 sm:text-sm">
              Treasury composition, marked to market daily. Movements require an AIP, a 72-hour timelock, and survive a public objection window.
            </p>
            <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              {TREASURY.map((t, i) => (
                <div key={t.asset} className="group min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-medium text-holo transition-colors duration-300 group-hover:text-cyber sm:text-sm">
                      {t.asset}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-dim sm:text-sm">
                      <AnimatedCounter to={t.value} prefix="$" suffix="M" />
                      <span className="ml-1.5 text-[10px] text-faint">{t.pct}%</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05] sm:h-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${t.color}88, ${t.color})`,
                        boxShadow: `0 0 14px ${t.color}55`,
                      }}
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
            <div className="mt-10 min-w-0 sm:mt-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">AIP lifecycle</p>
              <div className="mt-4 flex w-full items-center overflow-x-auto pb-2 no-scrollbar">
                {["Draft", "Temp. check", "Vote", "Timelock", "Execute"].map((s, i) => (
                  <div key={s} className="flex shrink-0 items-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          i === 2 ? "bg-cyber shadow-[0_0_12px_rgba(0,240,255,0.7)]" : "bg-white/20"
                        }`}
                      />
                      <span
                        className={`mt-2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.08em] sm:text-[9px] sm:tracking-[0.12em] ${
                          i === 2 ? "text-cyber" : "text-faint"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    {i < 4 && <span className="mx-2 mb-4 h-px w-6 bg-white/10 sm:w-10" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* proposals */}
          <div className="min-w-0">
            <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:text-[11px] sm:tracking-[0.28em]">
                  // Active proposals
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-holo sm:text-3xl md:text-4xl">
                  <TextReveal text="The floor is open." />
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyber" />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim sm:text-[10px]">
                  Your weight · {USER_WEIGHT.toLocaleString()} AETH
                </span>
              </div>
            </div>

            <div className="space-y-3 min-w-0">
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