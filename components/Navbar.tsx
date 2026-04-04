"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaGitAlt, FaTerminal, FaTasks, FaCheckCircle } from "react-icons/fa";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";

const MODULES = [
  { href: "/modules/repo",      label: "Repositori",      color: "#FFD93D", num: "01" },
  { href: "/modules/commit",    label: "Commit",          color: "#FF6B35", num: "02" },
  { href: "/modules/branch",    label: "Branch",          color: "#FF6B9D", num: "03" },
  { href: "/modules/merge",     label: "Merge",           color: "#A855F7", num: "04" },
  { href: "/modules/remote",    label: "Remote",          color: "#3B82F6", num: "05" },
  { href: "/modules/status",    label: "Status",          color: "#22C55E", num: "06" },
  { href: "/modules/gitignore", label: "Gitignore",       color: "#EF4444", num: "07" },
  { href: "/modules/undo",      label: "Undo & Reset",    color: "#F59E0B", num: "08" },
  { href: "/modules/log",       label: "Log & Diff",      color: "#06B6D4", num: "09" },
];

const EXTRAS = [
  { href: "/simulator", label: "Simulator", Icon: FaTerminal, color: "#1E1B2E" },
  { href: "/tasks",     label: "Tugas",     Icon: FaTasks,    color: "#1E1B2E" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const [doneModules, setDoneModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ids = MODULES.map((m) => m.href.split("/").pop()!);
    const done = new Set<string>();
    ids.forEach((id) => {
      try {
        const raw = localStorage.getItem(`git-sim-quiz-${id}`);
        if (raw && JSON.parse(raw).done) done.add(id);
      } catch {}
    });
    setDoneModules(done);
  }, [pathname]);

  const activeModule = MODULES.find((m) => pathname.startsWith(m.href));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-[#FFF9F0] border-b-[2.5px] border-[#1E1B2E]">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <FaGitAlt className="text-2xl text-[#F14E32]" />
          <span
            className="font-fredoka text-xl font-semibold text-[#1E1B2E] leading-none"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Git Simulator
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Modules dropdown */}
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setDropOpen((v) => !v)}
              className="relative px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors"
              style={{
                fontFamily: "var(--font-nunito)",
                color: activeModule ? activeModule.color : "#1E1B2E",
                background: activeModule ? activeModule.color + "22" : "transparent",
                border: activeModule ? `2px solid ${activeModule.color}` : "2px solid transparent",
              }}
            >
              {activeModule ? (
                <>
                  <span className="text-xs opacity-60">{activeModule.num}</span>{" "}
                  {activeModule.label}
                </>
              ) : (
                "Modul"
              )}
              <HiChevronDown
                className="transition-transform"
                style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {dropOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#FFF9F0] border-[2.5px] border-[#1E1B2E] rounded-xl shadow-[4px_4px_0px_#1E1B2E] overflow-hidden z-50">
                {MODULES.map((m) => {
                  const active = pathname.startsWith(m.href);
                  return (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-[#1E1B2E0A] transition-colors"
                      style={{
                        fontFamily: "var(--font-nunito)",
                        color: active ? m.color : "#1E1B2E",
                        background: active ? m.color + "15" : "transparent",
                        borderLeft: active ? `3px solid ${m.color}` : "3px solid transparent",
                      }}
                    >
                      <span
                        className="text-xs font-bold w-7 h-5 flex items-center justify-center rounded-md"
                        style={{ background: m.color + "30", color: m.color }}
                      >
                        {m.num}
                      </span>
                      <span className="flex-1">{m.label}</span>
                      {doneModules.has(m.href.split("/").pop()!) && (
                        <FaCheckCircle className="text-xs shrink-0" style={{ color: m.color }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-[#1E1B2E30] mx-1" />

          {/* Simulator & Tasks */}
          {EXTRAS.map((e) => {
            const active = pathname.startsWith(e.href);
            return (
              <Link
                key={e.href}
                href={e.href}
                className="relative px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
                style={{
                  fontFamily: "var(--font-nunito)",
                  color: active ? "#FF6B35" : "#1E1B2E",
                  background: active ? "#FF6B3522" : "transparent",
                  border: active ? "2px solid #FF6B35" : "2px solid transparent",
                }}
              >
                <e.Icon className="text-sm" />
                {e.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border-2 border-[#1E1B2E]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t-[2.5px] border-[#1E1B2E] bg-[#FFF9F0] px-4 py-3 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
          <p className="text-xs font-bold text-[#1E1B2E] opacity-40 uppercase tracking-wide px-2"
            style={{ fontFamily: "var(--font-nunito)" }}>
            Modul
          </p>
          {MODULES.map((m) => {
            const active = pathname.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-nunito)",
                  color: active ? m.color : "#1E1B2E",
                  background: active ? m.color + "22" : "#1E1B2E0A",
                  border: `2px solid ${active ? m.color : "#1E1B2E20"}`,
                }}
              >
                <span
                  className="text-xs font-bold w-7 h-5 flex items-center justify-center rounded-md shrink-0"
                  style={{ background: m.color + "30", color: m.color }}
                >
                  {m.num}
                </span>
                <span className="flex-1">{m.label}</span>
                {doneModules.has(m.href.split("/").pop()!) && (
                  <FaCheckCircle className="text-xs shrink-0" style={{ color: m.color }} />
                )}
              </Link>
            );
          })}

          <div className="h-px bg-[#1E1B2E20] my-1" />

          {EXTRAS.map((e) => {
            const active = pathname.startsWith(e.href);
            return (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-nunito)",
                  color: active ? "#FF6B35" : "#1E1B2E",
                  background: active ? "#FF6B3522" : "#1E1B2E0A",
                  border: `2px solid ${active ? "#FF6B35" : "#1E1B2E20"}`,
                }}
              >
                <e.Icon className="text-sm" />
                {e.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
