'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { GameBoard } from '@/app/_components/territory_battle';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export default function TerritoryBattlePage(): React.JSX.Element {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden flex flex-col items-center justify-center select-none py-1 sm:py-2 px-1 sm:px-2">
      {/* ============================================================== */}
      {/* Fantasy Sky & Castle Background Image (/territory_img/terr_bg.png) */}
      {/* ============================================================== */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{ backgroundImage: `url(${IMAGEKIT_URL}/territory_img/terr_bg.png)` }}
      />

      {/* Subtle depth vignette */}
      <div className="fixed inset-0 bg-radial from-transparent via-black/10 to-black/35 pointer-events-none z-0" />

      {/* ============================================================== */}
      {/* Top-Left MENU Button (Routes to /char_selection)                */}
      {/* ============================================================== */}
      <button
        type="button"
        onClick={() => router.push('/char_selection')}
        className="group fixed left-3 sm:left-6 top-3 sm:top-5 z-40 flex items-center gap-1.5 sm:gap-2 rounded-xl border-2 border-blue-400/70 bg-[#0c1633]/90 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] backdrop-blur-md transition-all hover:bg-blue-900/95 hover:border-yellow-400 hover:text-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.7)] active:scale-95 cursor-pointer leading-none"
      >
        <FiArrowLeft className="size-3.5 sm:size-4 transition-transform group-hover:-translate-x-1 shrink-0 stroke-[3]" />
        <span>MENU</span>
      </button>

      {/* ============================================================== */}
      {/* Main Interactive Game Board & Arcade HUD                        */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full flex justify-center">
        <GameBoard />
      </div>
    </main>
  );
}
