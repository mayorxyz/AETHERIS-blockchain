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
    detail: "Deployed through open grants, RFPs, hackathons and liquidity incentives. Every allocation is published on-chain and ratifiable by governance.",
  },
  {
    name: "Core Contributors",
    pct: 20,
    color: "#7B2CBF",
    vesting: "2-year lock, then 3-year linear",
    detail: "Fully locked for 24 months from genesis. Afterwards, unlocks linearly over 36 months to align the team with long-horizon performance.",
  },
  {
    name: "Investors",
    pct: 15,
    color: "#A86AE0",
    vesting: "12-month cliff · 24-month linear",
    detail: "Early backers sit behind a full year cliff, then vest monthly over two years. No private-round tokens circulated at launch.",
  },
  {
    name: "DAO Treasury",
    pct: 15,
    color: "#94A3B8",
    vesting: "Unlocked at genesis · AIP-governed",
    detail: "Controlled exclusively by token holders through the AIP process with a 4% quorum. Treasury movements are timelocked for 72 hours.",
  },
  {
    name: "Liquidity & Rewards",
    pct: 10,
    color: "#F5B74E",
    vesting: "Emission-linked · 12% annual decay",
    detail: "Staking rewards are minted against a decaying emission curve, tightening supply as participation — and security — grows.",
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
  const cx = 170, cy = 170, r = 118;

  let acc = 0;
  const arcs = SLICES.map((s, i) => {
    const start = acc + 1.4;
    const end = acc + s.pct * 3.6 - 1.4;
    const mid = acc + (s.pct * 3.6) / 2;
    acc += s.pct * 3.6;
    return { ...s, i, start, end, mid, d: arcPath(cx, cy, r, start, end) };
  });

  const activeSlice = active !== null ? SLICES[active] : null;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
      <div className="relative mx-auto w-full max-w-[340px]">
        <svg viewBox="0 0 340 340" className="w-full">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(226,232,240,0.05)" strokeWidth="30" />
          {arcs.map((a) => {
            const isActive = active === a.i;
            const [tx, ty] = [Math.cos(((a.mid - 90) * Math.PI) / 180) * 9, Math.sin(((a.mid - 90) * Math.PI) / 180) * 9];
            return (
              <motion.path
                key={a.name}
                d={a.d}
                fill="none"
                stroke={a.color}
                strokeLinecap="butt"
                onMouseEnter={() => setActive(a.i)}
                onMouseLeave={() => setActive(null)}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: a.i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                animate={{
                  x: isActive ? tx : 0,
                  y: isActive ? ty : 0,
                  strokeWidth: isActive ? 40 : 30,
                  opacity: active !== null && !isActive ? 0.35 : 1,
                }}
                style={{ filter: isActive ? `drop-shadow(0 0 14px ${a.color})` : "none", cursor: "pointer" }}
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlice ? activeSlice.name : "total"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="px-10"
            >
              {activeSlice ? (
                <>
                  <p className="font-mono text-3xl font-bold" style={{ color: activeSlice.color }}>
                    {activeSlice.pct}%
                  </p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-holo">{activeSlice.name}</p>
                  <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-dim">{activeSlice.vesting}</p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">Total supply</p>
                  <p className="mt-1.5 font-mono text-2xl font-medium text-holo md:text-3xl">1,000,000,000</p>
                  <p className="mt-1.5 font-mono text-xs text-cyber">AETH</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div>
        <div className="space-y-1.5">
          {arcs.map((a) => (
            <button
              key={a.name}
              onMouseEnter={() => setActive(a.i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(a.i)}
              onBlur={() => setActive(null)}
              className={`group flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all duration-300 ${
                active === a.i ? "border-white/15 bg-white/[0.05]" : "border-transparent hover:bg-white/[0.03]"
              }`}
            >
              <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: a.color, boxShadow: active === a.i ? `0 0 12px ${a.color}` : "none" }} />
              <span className="flex-1 text-sm font-medium text-holo">{a.name}</span>
              <span className="hidden font-mono text-[10px] text-faint sm:block">{a.vesting}</span>
              <span className="w-12 text-right font-mono text-sm" style={{ color: active === a.i ? a.color : "#8a93a6" }}>
                {a.pct}%
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 min-h-[92px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlice?.name ?? "hint"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4"
            >
              {activeSlice ? (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: activeSlice.color }}>
                    Vesting · {activeSlice.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{activeSlice.detail}</p>
                </>
              ) : (
                <p className="text-sm text-faint">
                  Hover a slice or a row to inspect its vesting schedule. Every token has a clock — nothing unlocks in the dark.
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
    <HolographicCard className="p-7 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Staking simulator</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-holo md:text-4xl">
            <TextReveal text="Put your stake to work." />
          </h2>
        </div>
        <div className="flex gap-2">
          {LOCKS.map((l, i) => (
            <button
              key={l.label}
              onClick={() => setLock(i)}
              className={`rounded-lg border px-4 py-2 font-mono text-xs tracking-[0.12em] transition-all duration-300 ${
                lock === i
                  ? "border-cyber/50 bg-cyber/10 text-cyber shadow-[0_0_18px_rgba(0,240,255,0.12)]"
                  : "border-white/10 text-dim hover:border-white/25 hover:text-holo"
              }`}
            >
              {l.label}
              <span className="ml-2 text-[9px] text-faint">×{l.boost}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="stake" className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              Stake amount
            </label>
            <p className="font-mono text-3xl font-medium text-holo md:text-4xl">
              <AnimatedCounter to={stake} duration={0.5} />
              <span className="ml-2 text-sm text-cyber">AETH</span>
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
            className="aeth-range mt-6"
            style={{ "--fill": `${fillPct}%` } as CSSProperties}
          />
          <div className="mt-3 flex justify-between font-mono text-[10px] text-faint">
            <span>1,000</span>
            <span className="text-cyber">LOCK · {LOCKS[lock].months} MONTHS · BOOST ×{boost}</span>
            <span>100,000</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
            <div className="bg-void p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Est. APY</p>
              <p className="mt-2 font-mono text-2xl text-cyber">
                <AnimatedCounter to={apy} decimals={1} suffix="%" duration={0.5} />
              </p>
            </div>
            <div className="bg-void p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Monthly yield</p>
              <p className="mt-2 font-mono text-2xl text-holo">
                <AnimatedCounter to={monthlyYield} decimals={1} duration={0.5} /> <span className="text-xs text-faint">AETH</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Estimated annual yield</p>
          <p className="mt-3 font-mono text-4xl font-medium text-holo md:text-5xl">
            <AnimatedCounter to={annualYield} decimals={0} duration={0.6} />
            <span className="ml-2 text-base text-cyber">AETH</span>
          </p>

          <div className="my-7 h-px w-full bg-gradient-to-r from-cyber/40 via-plasma/40 to-transparent" />

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Network voting power</p>
          <p className="mt-3 font-mono text-4xl font-medium text-holo md:text-5xl">
            <AnimatedCounter to={votingPower} decimals={3} suffix="%" duration={0.6} />
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyber to-plasma"
              animate={{ width: `${Math.max(0.4, votingPower * 8)}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Share of the {TOTAL_STAKED.toLocaleString()} AETH currently staked. Voting weight compounds with lock duration.
          </p>
        </div>
      </div>
    </HolographicCard>
  );
}

/* ---------------------------------- utility -------------------------------- */

const UTILITIES = [
  { k: "01", t: "Gas & Fees", d: "Every transaction, contract call and proof submission on Aetheris is metered in AETH." },
  { k: "02", t: "Staking & Security", d: "Validators bond AETH to propose and attest. Slashing keeps the machine honest." },
  { k: "03", t: "Governance", d: "AETH is the voting weight behind every AIP — from treasury spend to protocol parameters." },
  { k: "04", t: "Sequencer Revenue", d: "Ordering fees are pooled in AETH and redistributed to stakers every epoch." },
];

export default function Tokenomics() {
  return (
    <main>
      <PageHeader
        index="02"
        overline="Economic Model · AETH"
        title="A token with a clock."
        lede="One billion AETH, every unit accounted for. Fixed supply, published vesting, decaying emissions — an economic model you can audit line by line instead of trusting a paragraph."
        meta={["TICKER · AETH", "SUPPLY · 1,000,000,000", "INFLATION · DECAYING"]}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-wrap gap-x-10 gap-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
          <span>STANDARD <span className="text-cyber">NATIVE + ERC-20 WRAPPED</span></span>
          <span className="text-faint">/</span>
          <span>CONTRACT <span className="text-cyber">0x7B2C…F0FF</span></span>
          <span className="text-faint">/</span>
          <span>STAKED <span className="text-cyber">84.0M AETH</span></span>
        </div>

        <HolographicCard className="p-7 md:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Allocation & vesting</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-holo md:text-4xl">
            <TextReveal text="One billion, five commitments." />
          </h2>
          <div className="mt-10">
            <AllocationDonut />
          </div>
        </HolographicCard>
      </section>

      <section className="relative z-10 mx-auto mt-10 max-w-7xl px-5 md:px-8">
        <StakingSimulator />
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// Utility</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-holo">
              <TextReveal text="Four jobs, one token." />
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-dim">
              AETH is not a governance afterthought bolted onto a token sale.
              It is the fuel, the collateral, the ballot and the payroll of the
              network — simultaneously.
            </p>
          </div>
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {UTILITIES.map((u, i) => (
              <motion.div
                key={u.k}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="group flex gap-6 py-6 transition-colors duration-300 hover:bg-white/[0.02] md:gap-10 md:px-4"
              >
                <span className="font-mono text-xs text-cyber">{u.k}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-holo transition-colors duration-300 group-hover:text-cyber">{u.t}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-dim">{u.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
