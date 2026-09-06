import { useEffect, useRef } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import Layout from "./components/Layout";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Technology from "./pages/Technology";
import Tokenomics from "./pages/Tokenomics";
import Ecosystem from "./pages/Ecosystem";
import Developers from "./pages/Developers";
import Governance from "./pages/Governance";

function ScrollManager({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenisRef]);
  return null;
}

function Shell() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <Layout>
      {/* ambient structure */}
      <div className="blueprint-grid" aria-hidden="true" />
      <div className="dot-matrix" aria-hidden="true" />
      <div className="noise-veil" aria-hidden="true" />

      <ScrollManager lenisRef={lenisRef} />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/tokenomics" element={<Tokenomics />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </Layout>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <Shell />
      </HashRouter>
    </MotionConfig>
  );
}
