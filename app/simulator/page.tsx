"use client";

import Link from "next/link";
import { FaArrowLeft, FaTerminal } from "react-icons/fa";
import SimulatorLayout from "@/components/simulator/SimulatorLayout";

export default function SimulatorPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 bg-[#FFF9F0] border-b-[2.5px] border-[#1E1B2E] px-4 py-2 flex items-center gap-3">
        <Link
          href="/"
          className="btn-brutal px-3 py-1 text-xs bg-white flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-nunito)", fontWeight: 600, textDecoration: "none", color: "#1E1B2E" }}
        >
          <FaArrowLeft className="text-xs" /> Beranda
        </Link>
        <div className="flex items-center gap-2">
          <FaTerminal className="text-[#1E1B2E]" />
          <span
            className="font-bold text-sm text-[#1E1B2E]"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Git Simulator
          </span>
        </div>
        <span
          className="text-xs text-[#1E1B2E] opacity-50 hidden sm:block"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Ketik &quot;help&quot; untuk daftar perintah
        </span>
      </div>

      {/* Simulator fills remaining height */}
      <div className="flex-1 min-h-0">
        <SimulatorLayout storageKey="git-sim-free" />
      </div>
    </div>
  );
}
