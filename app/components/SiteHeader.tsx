"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  /**
   * Runs instead of navigating when the name is clicked. The home page passes
   * one to send the visitor back to the top, since a link to the page you are
   * already on would otherwise do nothing.
   */
  onHome?: () => void;
};

export default function SiteHeader({ onHome }: Props) {
  const pathname = usePathname();

  return (
    // Faded rather than solid: the Intro and each page's content scroll under
    // it, but the string's own stage should still read edge to edge.
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-ground via-ground/90 to-transparent px-5 pb-6 pt-4 sm:px-8">
      <Link
        href="/"
        onClick={(e) => {
          // Leave a modified click alone, so it can still open a new tab.
          if (!onHome || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          onHome();
        }}
        className="font-display text-[13px] font-extrabold tracking-[0.14em] text-ink transition-opacity hover:opacity-70"
      >
        SEAN MICHAEL
      </Link>
      <nav className="flex items-center gap-5">
        {/* Writing is off the nav until there is something newer than 2023 to
            point at. /blog and its posts still resolve for existing links. */}
        {links.map(({ href, label }) => {
          const current = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? "page" : undefined}
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                current ? "text-string" : "text-ink-faint hover:text-ink"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
