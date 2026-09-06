import type { ReactNode } from "react";

/**
 * Global layout wrapper.
 *
 * Clips accidental horizontal overflow at the shell boundary so no page
 * section (wide mono strings, decorative glows, fixed-width children)
 * can push the document wider than the viewport and trigger sideways
 * scrolling on mobile.
 *
 * Uses `overflow-x: clip` instead of `hidden` because clip does not
 * create a scroll container — `position: sticky` descendants (the
 * Technology side rail, the Developers IDE column) keep sticking to
 * the viewport. A `hidden` fallback is provided for older browsers
 * via @supports in index.css.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell relative min-h-screen w-full bg-void font-body text-holo">
      {children}
    </div>
  );
}
