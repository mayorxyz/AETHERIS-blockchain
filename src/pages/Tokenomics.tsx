import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import TextReveal from "../components/ui/TextReveal";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import HolographicCard from "../components/ui/HolographicCard";

/* ---------------------------------- data ---------------------------------- */

const SLICES = [
  {
    name: "Community & Ecosystem",
    pct: 40,
    color: "#00F0FF",
    vesting: "4-year linear vesting · 6-month cliff",
    detail:
      "Deployed through open grants, RFPs, hackathons and liquidity incentives. Every allocation is published on-chain and ratifiable by governance.",
  },
  {
    name: "Core Contributors",
    pct: 20,
    color: "#7B2CBF",
    vesting: "2-year lock, then 3-year linear",
    detail:
      "Fully locked for 24 months from genesis. Afterwards, unlocks linearly over 36 months to align the team with long-horizon performance.",
  },
  {
    name: "Investors",
    pct: 15,
    color: "#A86AE0",
    vesting: "12-month cliff · 24-month linear",
    detail:
      "Early backers sit behind a full year cliff, then vest monthly over two years. No private-round tokens circulated at launch.",
  },
  {
    name: "DAO Treasury",
    pct: 15,
    color: "#94A3B8",
    vesting: "Unlocked at genesis · AIP-governed",
    detail:
      "Controlled exclusively by token holders through the AIP process with a 4% quorum. Treasury movements are timelocked for 72 hours.",
  },
  {
    name: "Liquidity & Rewards",
    pct: 10,
    color: "#F5B74E",
    vesting: "Emission-linked · 12% annual decay",
    detail:
      "Staking rewards are minted against a decaying emission curve, tightening supply as participation — and security — grows.",
  },
];

const LOCKS = [
  { label: "3 MO", months: 3, boost: 1 },
  { label: "6 MO", months: 6, boost: 1.25 },
  { label: "12 MO", months: 12, boost: 1.5 },
];

const TOTAL_STAKED = 84_000_000;
const BASE_APY = 7.2;

/* --------------------------------- donut math ------------------------------ */

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const [sx, sy] = polar(cx, cy, r, start);
  const [ex, ey] = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

function AllocationDonut() {
  const [active, setActive] = useState<number | null>(null);
  const cx = 170,
    cy = 170,
    r = 118;

  let acc = 0;
  const arcs = SLICES.map((s, i) => {
    const start = acc + 1.4;
    const end = acc + s.pct * 3.6 - 1.4;
    const mid = acc + (s.pct * 3.6) / 2;
    acc += s.pct * 3.6;
    return { ...s, i, start, end, mid, d: arcPath(cx, cy, r, start, end) };
  });

  const activeSlice = active !== null ? SLICES[active] : null;

  const handleToggle = (index: number) => {
    setActive((prev) => (prev === index ? null : index));
  };

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[320px_1fr] lg:gap-14 xl:grid-cols-[360px_1fr]">
      {/* Visual Chart Frame */}
      <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]">
        <svg viewBox="0 0 340 340" className="h-auto w-full overflow-visible">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(226,232,240,0.05)"
            strokeWidth="30"
          />
          {arcs.map((a) => {
            const isActive = active === a.i;
            const [tx, ty] = [
              Math.cos(((a.mid - 90) * Math.PI) / 180) * 9,
              Math.sin(((a.mid - 90) * Math.PI) / 180) * 9,
            ];
            return (
              <motion.path
                key={a.name}
                d={a.d}
                fill="none"
                stroke={a.color}
                strokeLinecap="butt"
                onMouseEnter={() => setActive(a.i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => handleToggle(a.i)}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: a.i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                animate={{
                  x: isActive ? tx : 0,
                  y: isActive ? ty : 0,
                  strokeWidth: isActive ? 38 : 30,
                  opacity: active !== null && !isActive ? 0.35 : 1,
                }}
                style={{
                  filter: isActive ? `drop-shadow(0 0 14px ${a.color})` : "none",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </svg>

        {/* Center Display Badge */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlice ? activeSlice.name : "total"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="max-w-[190px] px-2 sm:max-w-[220px]"
            >
              {activeSlice ? (
                <>
                  <p
                    className="font-mono text-2xl font-bold sm:text-3xl"
                    style={{ color: activeSlice.color }}
                  >
                    {activeSlice.pct}%
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-holo sm:text-xs">
                    {activeSlice.name}
                  </p>
                  <p className="mt-1 line-clamp-2 font-mono text-[9px] leading-tight text-dim sm:text-[10px]">
                    {activeSlice.vesting}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint sm:text-[10px]">
                    Total supply
                  </p>
                  <p className="mt-1 font-mono text-xl font-medium text-holo sm:text-2xl md:text-3xl">
                    1,000,000,000
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-cyber sm:text-xs">AETH</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex flex-col justify-between space-y-6">
        <div className="space-y-2">
          {arcs.map((a) => (
            <button
              key={a.name}
              onMouseEnter={() => setActive(a.i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => handleToggle(a.i)}
              onFocus={() => setActive(a.i)}
              onBlur={() => setActive(null)}
              className={`group flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all duration-300 sm:flex-nowrap ${
                active === a.i
                  ? "border-white/20 bg-white/[0.06] shadow-lg"
                  : "border-white/[0.04] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm transition-transform duration-300 group-hover:scale-125"
                  style={{
                    background: a.color,
                    boxShadow: active === a.i ? `0 0 12px ${a.color}` : "none",
                  }}
                />
                <span className="min-w-0 truncate text-sm font-medium text-holo">{a.name}</span>
              </div>
              <span className="hidden font-mono text-[11px] text-faint md:block">
                {a.vesting}
              </span>
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: active === a.i ? a.color : "#8a93a6" }}
              >
                {a.pct}%
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Context Card */}
        <div className="min-h-[84px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlice?.name ?? "hint"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-md"
            >
              {activeSlice ? (
                <>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: activeSlice.color }}
                  >
                    Vesting Details · {activeSlice.name}
                  </p>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-dim">
                    {activeSlice.detail}
                  </p>
                </>
              ) : (
                <p className="text-xs sm:text-sm text-faint leading-relaxed">
                  Hover or tap an allocation slice to inspect its specific vesting parameters and unlock schedule.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ staking simulator -------------------------- */

function StakingSimulator() {
  const [stake, setStake] = useState(12_000);
  const [lock, setLock] = useState(1);

  const boost = LOCKS[lock].boost;
  const apy = BASE_APY * boost;
  const annualYield = (stake * apy) / 100;
  const monthlyYield = annualYield / 12;
  const votingPower = (stake / TOTAL_STAKED) * 100;
  const fillPct = ((stake - 1000) / 99000) * 100;

  return (
    <HolographicCard className="p-5 sm:p-8 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:text-[11px]">
            // Staking simulator
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-holo sm:text-3xl md:text-4xl">
            <TextReveal text="Put your stake to work." />
          </h2>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {LOCKS.map((l, i) => (
            <button
              key={l.label}
              onClick={() => setLock(i)}
              className={`flex-1 rounded-lg border px-3 py-2 text-center font-mono text-xs tracking-[0.1em] transition-all duration-300 sm:flex-none sm:px-4 ${
                lock === i
                  ? "border-cyber/50 bg-cyber/10 text-cyber shadow-[0_0_18px_rgba(0,240,255,0.12)]"
                  : "border-white/10 text-dim hover:border-white/25 hover:text-holo"
              }`}
            >
              {l.label}
              <span className="ml-1.5 text-[9px] opacity-75">×{l.boost}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        {/* Controls Column */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label
                htmlFor="stake"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim sm:text-[11px]"
              >
                Stake amount
              </label>
              <p className="font-mono text-2xl font-medium text-holo sm:text-3xl md:text-4xl">
                <AnimatedCounter to={stake} duration={0.4} />
                <span className="ml-2 text-xs text-cyber sm:text-sm">AETH</span>
              </p>
            </div>
            <input
              id="stake"
              type="range"
              min={1000}
              max={100000}
              step={500}
              value={stake}
              onChange={(e) => setStake(+e.target.value)}
              className="aeth-range mt-5 w-full cursor-pointer"
              style={{ "--fill": `${fillPct}%` } as CSSProperties}
            />
            <div className="mt-2.5 flex justify-between font-mono text-[9px] text-faint sm:text-[10px]">
              <span>1,000</span>
              <span className="hidden text-cyber sm:inline">
                LOCK · {LOCKS[lock].months} MONTHS · BOOST ×{boost}
              </span>
              <span>100,000</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
            <div className="bg-void/90 p-4 sm:p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint sm:text-[10px]">
                Est. APY
              </p>
              <p className="mt-1.5 font-mono text-2xl text-cyber sm:text-3xl">
                <AnimatedCounter to={apy} decimals={1} suffix="%" duration={0.4} />
              </p>
            </div>
            <div className="bg-void/90 p-4 sm:p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint sm:text-[10px]">
                Monthly yield
              </p>
              <p className="mt-1.5 font-mono text-2xl text-holo sm:text-3xl">
                <AnimatedCounter to={monthlyYield} decimals={1} duration={0.4} />{" "}
                <span className="text-xs text-faint">AETH</span>
              </p>
            </div>
          </div>
        </div>

        {/* Result Card Column */}
        <div className="flex flex-col justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 backdrop-blur-md">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              Estimated annual yield
            </p>
            <p className="mt-2 font-mono text-3xl font-medium text-holo sm:text-4xl md:text-5xl">
              <AnimatedCounter to={annualYield} decimals={0} duration={0.5} />
              <span className="ml-2 text-sm text-cyber sm:text-base">AETH</span>
            </p>
          </div>

          <div className="my-6 h-px w-full bg-gradient-to-r from-cyber/40 via-plasma/30 to-transparent" />

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              Network voting power
            </p>
            <p className="mt-2 font-mono text-3xl font-medium text-holo sm:text-4xl md:text-5xl">
              <AnimatedCounter to={votingPower} decimals={3} suffix="%" duration={0.5} />
            </p>
            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyber to-plasma"
                animate={{ width: `${Math.max(0.6, votingPower * 8)}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-faint">
              Share of {TOTAL_STAKED.toLocaleString()} AETH staked. Voting weight compounds with lock duration.
            </p>
          </div>
        </div>
      </div>
    </HolographicCard>
  );
}

/* ---------------------------------- utility -------------------------------- */

const UTILITIES = [
  {
    k: "01",
    t: "Gas & Fees",
    d: "Every transaction, contract call and proof submission on Aetheris is metered in AETH.",
  },
  {
    k: "02",
    t: "Staking & Security",
    d: "Validators bond AETH to propose and attest. Slashing keeps the machine honest.",
  },
  {
    k: "03",
    t: "Governance",
    d: "AETH is the voting weight behind every AIP — from treasury spend to protocol parameters.",
  },
  {
    k: "04",
    t: "Sequencer Revenue",
    d: "Ordering fees are pooled in AETH and redistributed to stakers every epoch.",
  },
];

export default function Tokenomics() {
  return (
    <main className="pb-16 sm:pb-24">
      <PageHeader
        index="02"
        overline="Economic Model · AETH"
        title="A token with a clock."
        lede="One billion AETH, every unit accounted for. Fixed supply, published vesting, decaying emissions — an economic model you can audit line by line instead of trusting a paragraph."
        meta={["TICKER · AETH", "SUPPLY · 1,000,000,000", "INFLATION · DECAYING"]}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Network Metrics Bar */}
        <div className="mb-8 flex flex-col flex-wrap gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-[10px] uppercase tracking-[0.16em] text-dim sm:flex-row sm:items-center sm:gap-x-8 sm:p-5 sm:text-[11px]">
          <div>
            STANDARD <span className="text-cyber">NATIVE + ERC-20 WRAPPED</span>
          </div>
          <span className="hidden text-faint sm:inline">/</span>
          <div>
            CONTRACT <span className="text-cyber">0x7B2C…F0FF</span>
          </div>
          <span className="hidden text-faint sm:inline">/</span>
          <div>
            STAKED <span className="text-cyber">84.0M AETH</span>
          </div>
        </div>

        {/* Allocation Card */}
        <HolographicCard className="p-5 sm:p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:text-[11px]">
            // Allocation & vesting
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-holo sm:text-3xl md:text-4xl">
            <TextReveal text="One billion, five commitments." />
          </h2>
          <div className="mt-8 sm:mt-10">
            <AllocationDonut />
          </div>
        </HolographicCard>
      </section>

      {/* Simulator Section */}
      <section className="relative z-10 mx-auto mt-8 sm:mt-12 max-w-7xl px-4 sm:px-6 md:px-8">
        <StakingSimulator />
      </section>

      {/* Utility Grid Section */}
      <section className="relative z-10 mx-auto mt-16 sm:mt-24 max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:text-[11px]">
              // Utility
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-holo sm:text-4xl">
              <TextReveal text="Four jobs, one token." />
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-dim sm:text-base">
              AETH is not a governance afterthought bolted onto a token sale. It is the fuel, the collateral, the ballot and the payroll of the network — simultaneously.
            </p>
          </div>

          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {UTILITIES.map((u, i) => (
              <motion.div
                key={u.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex gap-4 py-5 transition-colors duration-300 hover:bg-white/[0.02] sm:gap-8 sm:py-6 md:px-4"
              >
                <span className="font-mono text-xs text-cyber sm:text-sm">{u.k}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-holo transition-colors duration-300 group-hover:text-cyber sm:text-xl">
                    {u.t}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-dim">
                    {u.d}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}