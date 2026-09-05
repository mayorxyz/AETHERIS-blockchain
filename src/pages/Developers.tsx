import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import TextReveal from "../components/ui/TextReveal";
import HolographicCard from "../components/ui/HolographicCard";

/* ------------------------------ code token model --------------------------- */

type Tok = { t: string; c?: "kw" | "ty" | "cm" | "str" | "fn" | "num"; tip?: string };
type Line = Tok[];

const CODE: Line[] = [
  [{ t: "// HyperVault.sol — settle cross-chain proofs on Aetheris", c: "cm" }],
  [{ t: "pragma", c: "kw", tip: "Full Solidity 0.8.x support — no forked compiler, no rewrites. Your toolchain stays intact." }, { t: " solidity " }, { t: "^0.8.24", c: "num" }, { t: ";" }],
  [],
  [{ t: "import", c: "kw" }, { t: " { " }, { t: "AetherBridge", c: "ty", tip: "The precompiled bridge interface. Import it and cross-chain messaging is one call away." }, { t: " } " }, { t: "from", c: "kw" }, { t: " " }, { t: '"@aetheris/core"', c: "str" }, { t: ";" }],
  [],
  [{ t: "contract", c: "kw" }, { t: " " }, { t: "HyperVault", c: "fn" }, { t: " " }, { t: "is", c: "kw" }, { t: " " }, { t: "AetherBridge", c: "ty" }, { t: " {" }],
  [{ t: "    uint256", c: "ty" }, { t: " " }, { t: "public", c: "kw" }, { t: " " }, { t: "immutable", c: "kw" }, { t: " deployedAt;" }],
  [],
  [{ t: "    constructor", c: "fn" }, { t: "() {" }],
  [{ t: "        deployedAt = " }, { t: "block.timestamp", c: "num", tip: "Blocks finalize in 0.4s — timestamps here are as fresh as your local clock." }, { t: ";" }],
  [{ t: "    }" }],
  [],
  [{ t: "    function", c: "kw" }, { t: " " }, { t: "settle", c: "fn" }, { t: "(" }, { t: "bytes", c: "ty" }, { t: " " }, { t: "calldata", c: "kw" }, { t: " zkProof)" }],
  [{ t: "        external", c: "kw" }],
  [{ t: "        onlySequencer", c: "fn", tip: "Restricts execution to the current VRF-elected sequencer — ordering power rotates every 400ms." }],
  [{ t: "    {" }],
  [{ t: "        verify", c: "fn", tip: "Validates a 288-byte recursive SNARK on-chain in ~40ms. Cheaper than an ERC-20 transfer." }, { t: "(zkProof);" }, { t: "   // 40ms, on-chain", c: "cm" }],
  [{ t: "        emit", c: "kw" }, { t: " " }, { t: "Settled", c: "fn" }, { t: "(" }, { t: "msg.sender", c: "num" }, { t: ");" }],
  [{ t: "    }" }],
  [{ t: "}" }],
];

const TERM_COLORS: Record<string, string> = {
  kw: "#A86AE0",
  ty: "#00F0FF",
  cm: "#5a6373",
  str: "#F5B74E",
  fn: "#7ee7f2",
  num: "#F5B74E",
};

function flatten(lines: Line[]) {
  let total = 0;
  for (const line of lines) for (const tok of line) total += tok.t.length;
  return total;
}

const TOTAL = flatten(CODE);

function CodeToken({ tok }: { tok: Tok }) {
  const color = tok.c ? TERM_COLORS[tok.c] : "#E2E8F0";
  const style = {
    color,
    fontStyle: tok.c === "cm" ? ("italic" as const) : undefined,
  };
  if (tok.tip) {
    return (
      <span className="group/tok relative cursor-help rounded px-[1px]" style={{ ...style, textDecoration: "underline dotted rgba(0,240,255,0.45)", textUnderlineOffset: "4px" }}>
        {tok.t}
        <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-lg border border-cyber/25 bg-void/95 p-3 text-left text-[11px] font-normal leading-relaxed text-holo opacity-0 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-opacity duration-200 group-hover/tok:opacity-100" style={{ fontStyle: "normal", color: "#E2E8F0" }}>
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-cyber">{tok.t.trim()}</span>
          {tok.tip}
        </span>
      </span>
    );
  }
  return <span style={style}>{tok.t}</span>;
}

function FakeIDE() {
  const [chars, setChars] = useState(0);
  const done = chars >= TOTAL;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setChars((c) => Math.min(TOTAL, c + 3)), 16);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div className="holo overflow-hidden rounded-2xl">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-md border border-white/10 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[11px] text-holo">
            <span className="mr-2 text-cyber">◆</span>HyperVault.sol
          </span>
          <span className="px-3 py-1.5 font-mono text-[11px] text-faint">deploy.ts</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">aether-vm</span>
      </div>

      {/* code */}
      <div className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.85] md:px-6">
        {(() => {
          let remaining = chars;
          return CODE.map((line, li) => {
            const out: React.ReactNode[] = [];
            for (const tok of line) {
              if (remaining <= 0) break;
              const take = tok.t.slice(0, remaining);
              remaining -= tok.t.length;
              out.push(<CodeToken key={`${li}-${out.length}`} tok={{ ...tok, t: take }} />);
            }
            return (
              <div key={li} className="flex min-h-[1.85em]">
                <span className="mr-5 w-5 shrink-0 select-none text-right text-faint/60">{li + 1}</span>
                <span className="whitespace-pre">{out}</span>
              </div>
            );
          });
        })()}
        {!done && <span className="caret-blink ml-12 inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-cyber" />}
      </div>

      {/* terminal */}
      <div className={`border-t border-white/[0.07] bg-[#050508] px-5 py-4 font-mono text-[12px] leading-relaxed transition-opacity duration-500 md:px-6 ${done ? "opacity-100" : "opacity-30"}`}>
        <p className="text-dim"><span className="text-cyber">$</span> aether deploy --network mainnet</p>
        {done && (
          <>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-holo/85">
              <span className="text-[#28c840]">✓</span> Compiled HyperVault · solc 0.8.24
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-holo/85">
              <span className="text-[#28c840]">✓</span> Deployed → <span className="text-cyber">0x7f3a…9c2e</span>
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-holo/85">
              <span className="text-[#a86ae0]">⛓</span> Finalized in <span className="text-cyber">0.4s</span> · block #18,442,097
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- page ----------------------------------- */

const FEATURES = [
  { k: "EVM-equivalent", d: "Bring your Solidity, Foundry and Hardhat. Bytecode runs unchanged — verified, not 'compatible'." },
  { k: "0.4s finality", d: "Transactions are irreversible before the spinner finishes. Build UX that assumes certainty." },
  { k: "Native account abstraction", d: "ERC-4337 baked into the protocol layer. Gas sponsorship and session keys out of the box." },
  { k: "Free testnet, forever", d: "Unlimited faucet, persistent state, and an explorer that indexes in real time." },
];

const STEPS = [
  { n: "01", t: "Install the CLI", code: "npm i -g @aetheris/cli" },
  { n: "02", t: "Scaffold a project", code: "aether init my-protocol" },
  { n: "03", t: "Deploy to testnet", code: "aether deploy --network testnet" },
];

export default function Developers() {
  return (
    <main>
      <PageHeader
        index="04"
        overline="Developers · Ship Fast"
        title="Build in minutes, not months."
        lede="EVM-equivalent, fully documented, and fast enough that your loading states become obsolete. The watch window is writing a contract right now — hover the underlined terms to see what the protocol does for you."
        meta={["CHAIN ID 9421", "SOLIDITY · VYPER · RUST", "MIT TOOLING"]}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* left: narrative */}
          <div>
            <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-holo md:text-4xl">
              <TextReveal text="Your stack already speaks Aetheris." />
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-dim">
              No new VM to learn, no exotic compiler flags, no six-week
              migration. If it deploys to Ethereum today, it deploys to
              Aetheris today — except it settles 30× faster and costs a
              fraction of a cent.
            </p>

            <div className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.k}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex gap-6 py-5 transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <span className="mt-1 block h-6 w-px bg-cyber/50 transition-all duration-300 group-hover:w-[3px] group-hover:bg-cyber group-hover:shadow-[0_0_12px_rgba(0,240,255,0.6)]" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-holo transition-colors duration-300 group-hover:text-cyber">{f.k}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-dim">{f.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {[
                { label: "Documentation", arrow: true },
                { label: "GitHub", arrow: true },
                { label: "Grants — up to $250k", arrow: false },
              ].map((b) => (
                <Link
                  key={b.label}
                  to="/ecosystem"
                  className="holo group flex items-center gap-2.5 rounded-lg px-5 py-3 text-sm font-semibold text-holo transition-colors duration-300 hover:text-cyber"
                >
                  {b.label}
                  {b.arrow && (
                    <svg width="12" height="12" viewBox="0 0 12 12" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* right: IDE */}
          <div className="lg:sticky lg:top-28">
            <FakeIDE />
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
              Live deployment · hover underlined terms for protocol notes
            </p>
          </div>
        </div>
      </section>

      {/* getting started */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-faint">// First block in three commands</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-holo md:text-5xl">
          <TextReveal text="Zero to deployed, 90 seconds." />
        </h2>
        <div className="mt-12 space-y-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <HolographicCard className="group flex flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between md:p-7">
                <div className="flex items-center gap-6">
                  <span className="font-display text-4xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(0,240,255,0.45)]">{s.n}</span>
                  <span className="font-display text-xl font-semibold text-holo transition-colors duration-300 group-hover:text-cyber">{s.t}</span>
                </div>
                <code className="rounded-lg border border-white/10 bg-[#050508] px-4 py-2.5 font-mono text-[12.5px] text-cyber">
                  <span className="mr-2 select-none text-faint">$</span>
                  {s.code}
                </code>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
