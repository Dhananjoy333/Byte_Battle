'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { GameBoard } from '@/app/_components/territory_battle';

export default function TerritoryBattlePage(): React.JSX.Element {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#07080e] flex flex-col items-center justify-center select-none py-12 px-3 sm:px-6">
      {/* ============================================================== */}
      {/* Background Atmosphere & Cyber Grids                            */}
      {/* ============================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Subtle Green Ambient Glow (Player 1 Corner) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px]" />

        {/* Subtle Red Ambient Glow (Player 2 Corner) */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-rose-500/10 blur-[100px]" />

        {/* Central Tactical Lighting */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[60vh] rounded-full bg-yellow-400/5 blur-[120px]" />

        {/* Cyber Arena Floor Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* ============================================================== */}
      {/* Back Button (Returns to Character Selection)                    */}
      {/* ============================================================== */}
      <button
        type="button"
        onClick={() => router.push('/char_selection')}
        className="group absolute left-3 sm:left-6 md:left-8 top-3 sm:top-5 md:top-6 z-30 flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-100/70 backdrop-blur-md transition-all hover:border-yellow-400/50 hover:text-yellow-300 active:scale-95 cursor-pointer leading-none"
      >
        <FiArrowLeft className="size-3 sm:size-3.5 transition-transform group-hover:-translate-x-1 shrink-0" />
        <span className="leading-none">Roster</span>
      </button>

      {/* ============================================================== */}
      {/* Top Cyber Badge / Header                                        */}
      {/* ============================================================== */}
      <div className="relative z-20 flex flex-col items-center mb-2 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="h-px w-6 sm:w-12 bg-gradient-to-r from-transparent to-yellow-400" />
          <span className="font-general text-[9px] sm:text-xs uppercase tracking-[0.3em] text-yellow-300/85 font-semibold">
            Territory Protocol
          </span>
          <span className="h-px w-6 sm:w-12 bg-gradient-to-l from-transparent to-yellow-400" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-zinc-100 mt-1">
          Territory Battle
        </h1>
      </div>

      {/* ============================================================== */}
      {/* Main Interactive Game Board Component                           */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full flex justify-center">
        <GameBoard />
      </div>
    </main>
  );
}
