import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { to: "/technology", label: "Technology", index: "01" },
  { to: "/tokenomics", label: "Tokenomics", index: "02" },
  { to: "/ecosystem", label: "Ecosystem", index: "03" },
  { to: "/developers", label: "Developers", index: "04" },
  { to: "/governance", label: "Governance", index: "05" },
];

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <svg width="30" height="30" viewBox="0 0 32 32" className="shrink-0">
        <path
          d="M16 4l10 5.8v11.6L16 27.2 6 21.4V9.8L16 4z"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="1.5"
          className="transition-all duration-500 group-hover:stroke-[#a86ae0]"
        />
        <path d="M16 10.5l4.8 2.8v5.4L16 21.5l-4.8-2.8v-5.4L16 10.5z" fill="none" stroke="rgba(226,232,240,0.45)" strokeWidth="1" />
        <circle cx="16" cy="16" r="2.4" fill="#7B2CBF" className="transition-all duration-500 group-hover:fill-[#00F0FF]" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-[0.22em] text-holo">
        AETHERIS
      </span>
    </Link>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`absolute inset-x-3 top-2 -z-10 h-full rounded-2xl border transition-all duration-500 md:inset-x-6 ${
            scrolled
              ? "border-white/[0.07] bg-void/75 opacity-100 backdrop-blur-xl"
              : "border-transparent bg-transparent opacity-0"
          }`}
        />
        <Wordmark />

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative flex items-baseline gap-1.5 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? "text-cyber" : "text-dim hover:text-holo"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="font-mono text-[10px] text-faint transition-colors group-hover:text-cyber">
                    {l.index}
                  </span>
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-cyber transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/developers"
            className="group hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-holo transition-all duration-300 hover:border-cyber/50 hover:bg-cyber/10 hover:text-cyber hover:shadow-[0_0_24px_rgba(0,240,255,0.15)] sm:flex"
          >
            Launch App
            <svg width="12" height="12" viewBox="0 0 12 12" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/10 bg-white/[0.04] lg:hidden"
          >
            <span className={`h-px w-4 bg-holo transition-all duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-4 bg-holo transition-all duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-3 mt-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-void/90 backdrop-blur-2xl lg:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-white/[0.05] px-6 py-4 text-sm font-medium last:border-0 ${
                      isActive ? "text-cyber" : "text-holo"
                    }`
                  }
                >
                  <span>{l.label}</span>
                  <span className="font-mono text-[10px] text-faint">{l.index}</span>
                </NavLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: LINKS.length * 0.05 }}
              className="p-4"
            >
              <Link
                to="/developers"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-holo"
              >
                Launch App
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
