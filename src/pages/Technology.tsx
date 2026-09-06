import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import PageHeader from "../components/PageHeader";
import TextReveal from "../components/ui/TextReveal";
import AnimatedCounter from "../components/ui/AnimatedCounter";

/* ---------------------------------- data ---------------------------------- */

const SECTIONS = [
  {
    num: "01",
    title: "Parallel Execution",
    copy: "Most blockchains process transactions one at a time — a single lane for the entire world's demand. Aetheris schedules transactions into independent lanes before they ever touch the EVM. Conflicting state accesses are detected statically and share a lane; everything else executes simultaneously across 32 cores. Deterministic ordering guarantees every validator reaches the identical state — without re-executing a single instruction.",
    specs: ["100k TPS", "32 LANES", "STATIC CONFLICT DETECTION"],
    diagram: "parallel" as const,
  },
  {
    num: "02",
    title: "Zero-Knowledge Proofs",
    copy: "Trust is expensive; mathematics is not. Every epoch, the chain's entire execution history is folded into a single 288-byte recursive SNARK. Anyone — a phone, a browser tab, a light client on dial-up — can verify the full state of the network in 40 milliseconds, without trusting anyone's word. Provers compete to generate proofs; the protocol only ever checks them.",
    specs: ["288B PROOF", "40ms VERIFY", "RECURSIVE SNARK"],
    diagram: "zk" as const,
  },
  {
    num: "03",
    title: "Decentralized Sequencing",
    copy: "Ordering transactions is power — and on most chains, that power sits in one pair of hands. Aetheris rotates the sequencer every 400 milliseconds, chosen by a verifiable random function no participant can predict or influence. No permanent MEV extraction. No single point of censorship. The value of ordering flows back to the network instead of out of it.",
    specs: ["400ms ROTATION", "VRF SELECTION", "SHARED SEQUENCER REVENUE"],
    diagram: "sequencing" as const,
  },
];

type Tip = { x: number; y: number; title: string; body: string };

/* ------------------------------- diagram bits ------------------------------ */

function DiagramShell({
  children,
  tip,
  label,
}: {
  children: React.ReactNode;
  tip: Tip | null;
  label: string;
}) {
  return (
    <div className="holo relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      <div className="absolute left-5 top-4 z-10 flex items-center gap-2.5">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyber" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{label}</span>
      </div>
      <div className="absolute right-5 top-4 z-10 font-mono text-[10px] tracking-[0.2em] text-faint">
        FIG.{label.split(" ")[0]}
      </div>
      {children}
      <AnimatePresence>
        {tip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute z-20 w-52 -translate-x-1/2 -translate-y-full rounded-lg border border-cyber/25 bg-void/90 p-3 backdrop-blur-xl"
            style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyber">{tip.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-holo/90">{tip.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NodeDot({
  cx, cy, r = 5, cyan = true, onHover, onLeave,
}: {
  cx: number; cy: number; r?: number; cyan?: boolean;
  onHover: () => void; onLeave: () => void;
}) {
  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onHover}
      className="cursor-crosshair"
    >
      <circle cx={cx} cy={cy} r={r + 9} fill="transparent" />
      <circle cx={cx} cy={cy} r={r} fill={cyan ? "#00F0FF" : "#7B2CBF"} opacity={0.9} />
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={cyan ? "rgba(0,240,255,0.35)" : "rgba(123,44,191,0.45)"} />
    </g>
  );
}

/* -------------------------- diagram: parallel exec ------------------------- */

function ParallelDiagram() {
  const [tip, setTip] = useState<Tip | null>(null);
  const lanes = [
    { y: 78, color: "#00F0FF", w: 46, d: 0 },
    { y: 148, color: "#A86AE0", w: 34, d: 0.5 },
    { y: 218, color: "#00F0FF", w: 52, d: 1.0 },
    { y: 288, color: "#A86AE0", w: 40, d: 1.5 },
  ];

  return (
    <DiagramShell tip={tip} label="HYPERGRID / EXECUTION">
      <svg viewBox="0 0 480 360" className="h-full w-full">
        {lanes.map((l, i) => (
          <g key={i}>
            <line x1="92" y1={l.y} x2="430" y2={l.y} stroke="rgba(226,232,240,0.08)" strokeDasharray="3 6" />
            <text x="92" y={l.y - 12} fill="rgba(138,147,166,0.8)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">
              LANE {i}
            </text>
          </g>
        ))}

        {/* scheduler */}
        <rect x="20" y="130" width="52" height="100" rx="6" fill="rgba(123,44,191,0.14)" stroke="rgba(168,106,224,0.5)" />
        <text x="46" y="172" textAnchor="middle" fill="#A86AE0" fontSize="8.5" fontFamily="JetBrains Mono" letterSpacing="1.5">STATIC</text>
        <text x="46" y="186" textAnchor="middle" fill="#A86AE0" fontSize="8.5" fontFamily="JetBrains Mono" letterSpacing="1.5">SCHED.</text>

        {lanes.map((l, i) => (
          <line key={`c${i}`} x1="72" y1="180" x2="92" y2={l.y} stroke="rgba(0,240,255,0.3)" strokeDasharray="4 5" className="dash-flow" />
        ))}

        {/* flowing blocks */}
        {lanes.map((l, i) =>
          [0, 1].map((k) => (
            <motion.rect
              key={`${i}-${k}`}
              y={l.y - 9}
              width={l.w}
              height="18"
              rx="4"
              fill={l.color}
              opacity={0.85}
              initial={{ x: 92 }}
              animate={{ x: [92, 430 - l.w] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "linear", delay: l.d + k * 1.3 }}
            />
          ))
        )}

        <rect x="430" y="70" width="34" height="226" rx="6" fill="rgba(0,240,255,0.06)" stroke="rgba(0,240,255,0.35)" />
        <text x="447" y="188" textAnchor="middle" fill="#00F0FF" fontSize="8.5" fontFamily="JetBrains Mono" letterSpacing="1.5" transform="rotate(90 447 183)">
          STATE
        </text>

        <NodeDot cx={46} cy={110} cyan={false}
          onHover={() => setTip({ x: 18, y: 26, title: "Static scheduler", body: "Reads access-lists ahead of time; conflicting transactions are routed to the same lane." })}
          onLeave={() => setTip(null)} />
        <NodeDot cx={447} cy={60}
          onHover={() => setTip({ x: 86, y: 14, title: "Merged state root", body: "All 32 lanes commit a single deterministic state root per block." })}
          onLeave={() => setTip(null)} />
      </svg>
    </DiagramShell>
  );
}

/* ----------------------------- diagram: zk proof --------------------------- */

function ZKDiagram() {
  const [tip, setTip] = useState<Tip | null>(null);
  const circuit: [number, number][] = [
    [60, 70], [60, 140], [60, 210], [60, 280],
    [150, 105], [150, 175], [150, 245],
    [240, 140], [240, 210],
  ];

  return (
    <DiagramShell tip={tip} label="ZK / SETTLEMENT">
      <svg viewBox="0 0 480 360" className="h-full w-full">
        {/* circuit wires */}
        {circuit.map(([x, y], i) =>
          circuit.slice(i + 1).map(([x2, y2], j) => {
            if (Math.hypot(x - x2, y - y2) < 110)
              return <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(168,106,224,0.28)" />;
            return null;
          })
        )}
        {circuit.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#A86AE0" opacity="0.85" />
        ))}

        {/* compression funnel */}
        <path d="M250 140 C 320 150, 330 172, 360 178" fill="none" stroke="rgba(0,240,255,0.35)" strokeDasharray="4 5" className="dash-flow" />
        <path d="M250 210 C 320 205, 330 186, 360 182" fill="none" stroke="rgba(0,240,255,0.35)" strokeDasharray="4 5" className="dash-flow" />

        {/* travelling pulses */}
        {[0, 1, 2].map((k) => (
          <motion.circle
            key={k}
            r="3"
            fill="#00F0FF"
            initial={{ cx: 70, cy: 105 + k * 70, opacity: 0 }}
            animate={{ cx: [70, 240, 366], cy: [105 + k * 70, 175, 180], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: k * 0.8 }}
          />
        ))}

        {/* proof hexagon */}
        <motion.g
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "400px 180px" }}
        >
          <path d="M400 148l30 16v32l-30 16-30-16v-32z" fill="rgba(0,240,255,0.08)" stroke="#00F0FF" strokeWidth="1.4" />
          <text x="400" y="177" textAnchor="middle" fill="#00F0FF" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="1">SNARK</text>
          <text x="400" y="191" textAnchor="middle" fill="rgba(226,232,240,0.7)" fontSize="8" fontFamily="JetBrains Mono">288B</text>
        </motion.g>

        <text x="60" y="40" textAnchor="middle" fill="rgba(138,147,166,0.9)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">EPOCH TXS</text>
        <text x="400" y="246" textAnchor="middle" fill="rgba(138,147,166,0.9)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">VERIFY: 40ms</text>

        <NodeDot cx={150} cy={175}
          onHover={() => setTip({ x: 31, y: 44, title: "Witness generation", body: "Provers compile execution traces into polynomial witnesses off-chain." })}
          onLeave={() => setTip(null)} />
        <NodeDot cx={240} cy={140} cyan={false}
          onHover={() => setTip({ x: 50, y: 34, title: "KZG commitment", body: "Commitments bind every witness to a single verifiable polynomial." })}
          onLeave={() => setTip(null)} />
        <NodeDot cx={400} cy={212}
          onHover={() => setTip({ x: 80, y: 56, title: "Recursive proof", body: "Epoch proofs fold into one another — the whole chain verifies in a single check." })}
          onLeave={() => setTip(null)} />
      </svg>
    </DiagramShell>
  );
}

/* --------------------------- diagram: sequencing --------------------------- */

function SequencingDiagram() {
  const [tip, setTip] = useState<Tip | null>(null);
  const cx = 240, cy = 190, r = 112;
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), i };
  });

  return (
    <DiagramShell tip={tip} label="PULSE / SEQUENCING">
      <svg viewBox="0 0 480 360" className="h-full w-full">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(226,232,240,0.1)" strokeDasharray="2 6" />

        {/* rotating proposer arc */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6.4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <path
            d={`M ${cx} ${cy - r - 14} A ${r + 14} ${r + 14} 0 0 1 ${cx + (r + 14) * Math.sin(Math.PI / 3)} ${cy - (r + 14) * Math.cos(Math.PI / 3)}`}
            fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"
          />
          <circle cx={cx} cy={cy - r} r="6" fill="#00F0FF" />
          <circle cx={cx} cy={cy - r} r="11" fill="none" stroke="rgba(0,240,255,0.4)" />
        </motion.g>

        {nodes.map((n) => (
          <g key={n.i}>
            <circle cx={n.x} cy={n.y} r="13" fill="rgba(255,255,255,0.03)" stroke="rgba(226,232,240,0.18)" />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fill="rgba(226,232,240,0.75)" fontSize="8" fontFamily="JetBrains Mono">
              {String(n.i).padStart(2, "0")}
            </text>
          </g>
        ))}

        {/* center VRF core */}
        <rect x={cx - 44} y={cy - 26} width="88" height="52" rx="8" fill="rgba(123,44,191,0.14)" stroke="rgba(168,106,224,0.55)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#A86AE0" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="2">VRF SEED</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(226,232,240,0.6)" fontSize="7.5" fontFamily="JetBrains Mono" letterSpacing="1">ROTATION 400ms</text>

        <NodeDot cx={cx} cy={cy - r}
          onHover={() => setTip({ x: 50, y: 14, title: "Active sequencer", body: "Holds ordering rights for exactly one 400ms slot — then rotation continues." })}
          onLeave={() => setTip(null)} />
        <NodeDot cx={nodes[2].x} cy={nodes[2].y} cyan={false}
          onHover={() => setTip({ x: 72, y: 52, title: "Validator 02", body: "Next in the VRF-derived order. Selection is unpredictable until the slot opens." })}
          onLeave={() => setTip(null)} />
        <NodeDot cx={nodes[6].x} cy={nodes[6].y}
          onHover={() => setTip({ x: 26, y: 88, title: "Validator 06", body: "Revenue from ordering fees is pooled and redistributed to all stakers." })}
          onLeave={() => setTip(null)} />
      </svg>
    </DiagramShell>
  );
}

/* --------------------------------- scrolly --------------------------------- */

function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.65", "end 0.55"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.max(0, Math.min(2, Math.floor(v * 3.001))));
  });

  return (
    <section ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      {/* ---------------- Desktop Layout (Hidden on Mobile) ---------------- */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Scrolling Narrative */}
        <div className="order-1">
          {SECTIONS.map((s, i) => (
            <div key={s.num} className="flex min-h-[92vh] items-center">
              <div className={active === i ? "" : "opacity-30 transition-opacity duration-300"}>
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-7xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(0,240,255,0.4)] md:text-8xl">
                    {s.num}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyber/40 to-transparent" />
                </div>
                <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-holo md:text-5xl">
                  <TextReveal text={s.title} />
                </h2>
                <p className="mt-6 max-w-xl leading-relaxed text-dim">{s.copy}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {s.specs.map((spec) => (
                    <span key={spec} className="rounded border border-cyber/20 bg-cyber/[0.04] px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-cyber">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Diagram Pin */}
        <div className="order-2">
          <div className="sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={SECTIONS[active].diagram}
                initial={{ opacity: 0, scale: 0.97, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -14 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {SECTIONS[active].diagram === "parallel" && <ParallelDiagram />}
                {SECTIONS[active].diagram === "zk" && <ZKDiagram />}
                {SECTIONS[active].diagram === "sequencing" && <SequencingDiagram />}
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
              Hover the nodes — every component has a spec sheet
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile Layout (Inline Diagrams) ---------------- */}
      <div className="flex flex-col gap-16 lg:hidden">
        {SECTIONS.map((s) => (
          <div key={s.num} className="flex flex-col gap-8 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-6">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(0,240,255,0.4)]">
                  {s.num}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyber/40 to-transparent" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-holo">
                {s.title}
              </h2>
              <p className="mt-4 leading-relaxed text-dim text-sm">{s.copy}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.specs.map((spec) => (
                  <span key={spec} className="rounded border border-cyber/20 bg-cyber/[0.04] px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-cyber">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Inline Diagram for Mobile */}
            <div className="w-full">
              {s.diagram === "parallel" && <ParallelDiagram />}
              {s.diagram === "zk" && <ZKDiagram />}
              {s.diagram === "sequencing" && <SequencingDiagram />}
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                Tap nodes for details
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Rail (Desktop Only) */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {SECTIONS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`font-mono text-[9px] transition-colors duration-300 ${active === i ? "text-cyber" : "text-faint"}`}>{s.num}</span>
            <span className={`h-px transition-all duration-500 ${active === i ? "w-8 bg-cyber" : "w-4 bg-white/15"}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Numbers() {
  const stats = [
    { value: 100, suffix: "k", label: "Transactions / second" },
    { value: 0.4, suffix: "s", decimals: 1, label: "Time to finality" },
    { value: 40, suffix: "ms", label: "Proof verification" },
    { value: 1240, suffix: "", label: "Validators worldwide" },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 pt-24 md:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="group bg-void px-7 py-10 transition-colors duration-300 hover:bg-white/[0.03]">
            <p className="font-mono text-3xl font-medium text-holo transition-colors duration-300 group-hover:text-cyber md:text-4xl">
              <AnimatedCounter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-faint">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl font-display text-2xl font-semibold leading-snug text-holo md:text-3xl">
        <TextReveal text="Read the full specification — 62 pages of consensus math, lane scheduling and proof recursion." />
      </p>
      <div className="mt-6">
        <Link
          to="/developers"
          className="holo group inline-flex items-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold text-holo transition-colors duration-300 hover:text-cyber"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" className="text-cyber">
            <path d="M2 12V2h7l3 3v7H2zM9 2v3h3" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          Read the full specification · v2.4
          <svg width="13" height="13" viewBox="0 0 13 13" className="transition-transform duration-300 group-hover:translate-y-0.5">
            <path d="M6.5 1v9M3 7l3.5 3.5L10 7" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function Technology() {
  return (
    <main>
      <PageHeader
        index="01"
        overline="Architecture · Deep Dive"
        title="The stack, explained."
        lede="Three breakthroughs composed into one machine: transactions execute in parallel, epochs settle as a single zero-knowledge proof, and the right to order transactions rotates beyond anyone's control. Scroll — each subsystem builds itself in front of you."
        meta={["SPEC v2.4", "62 PAGES", "PEER-REVIEWED"]}
      />
      <div className="relative z-10 mx-auto mb-16 max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
          <span>EXECUTION <span className="text-cyber">HYPERGRID</span></span>
          <span className="text-faint">/</span>
          <span>CONSENSUS <span className="text-cyber">PULSE BFT</span></span>
          <span className="text-faint">/</span>
          <span>DA <span className="text-cyber">PRISM</span></span>
          <span className="text-faint">/</span>
          <span>SETTLEMENT <span className="text-cyber">ZK SNARK</span></span>
        </div>
      </div>
      <Scrollytelling />
      <Numbers />
    </main>
  );
}
