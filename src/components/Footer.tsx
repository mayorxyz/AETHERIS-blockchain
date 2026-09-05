import { Link } from "react-router-dom";
import AnimatedCounter from "./ui/AnimatedCounter";

const PROTOCOL = [
  { label: "Technology", to: "/technology" },
  { label: "Tokenomics", to: "/tokenomics" },
  { label: "Ecosystem", to: "/ecosystem" },
  { label: "Governance", to: "/governance" },
];

const BUILD = [
  { label: "Developers", to: "/developers" },
  { label: "Documentation", to: "/developers" },
  { label: "Grants Program", to: "/ecosystem" },
  { label: "Whitepaper", to: "/technology" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-[13px] font-semibold tracking-[0.22em] text-holo">
              AETHERIS
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-dim">
              The foundational settlement layer for the next internet. Parallel
              execution, zero-knowledge proofs, decentralized sequencing.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <span className="live-dot h-2 w-2 rounded-full bg-cyber" />
              <span className="font-mono text-xs text-dim">
                All systems operational · epoch{" "}
                <AnimatedCounter to={84213} duration={2} className="text-cyber" />
              </span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Protocol</p>
            <ul className="mt-4 space-y-2.5">
              {PROTOCOL.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="group text-sm text-dim transition-colors hover:text-cyber">
                    <span className="mr-2 inline-block font-mono text-[10px] text-faint transition-colors group-hover:text-cyber">→</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Build</p>
            <ul className="mt-4 space-y-2.5">
              {BUILD.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="group text-sm text-dim transition-colors hover:text-cyber">
                    <span className="mr-2 inline-block font-mono text-[10px] text-faint transition-colors group-hover:text-cyber">→</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Network</p>
            <div className="mt-4 space-y-2 font-mono text-xs text-dim">
              <p className="flex justify-between border-b border-white/[0.05] pb-2">
                <span className="text-faint">CHAIN ID</span>
                <span className="text-holo">9421</span>
              </p>
              <p className="flex justify-between border-b border-white/[0.05] pb-2">
                <span className="text-faint">RPC</span>
                <span className="text-cyber">rpc.aetheris.network</span>
              </p>
              <p className="flex justify-between border-b border-white/[0.05] pb-2">
                <span className="text-faint">FINALITY</span>
                <span className="text-holo">0.4s</span>
              </p>
              <p className="flex justify-between">
                <span className="text-faint">EXPLORER</span>
                <span className="text-holo">scan.aetheris.network</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] text-faint">
            © 2026 AETHERIS LABS — SETTLEMENT FOR THE OPEN INTERNET
          </p>
          <p className="font-mono text-[11px] text-faint">
            51.5074°N 0.1278°W · BLOCK <span className="text-dim">#18,442,091</span>
          </p>
        </div>
      </div>

      <div className="pointer-events-none overflow-hidden px-2" aria-hidden="true">
        <p className="text-outline select-none whitespace-nowrap text-center font-display text-[18vw] font-bold leading-[0.85] tracking-tight opacity-60">
          AETHERIS
        </p>
      </div>
    </footer>
  );
}
