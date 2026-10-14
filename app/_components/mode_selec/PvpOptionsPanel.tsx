"use client";

import React, { useState, forwardRef } from "react";

interface PvpOptionsPanelProps {
  onFindMatch?: () => void;
  onConnectRoom?: (roomId: string) => void;
  dividerRef?: React.RefObject<HTMLDivElement | null>;
}

// Pixelated cyber bracket corners matching retro gaming aesthetic
const CyberCorners = ({ color }: { color: string }) => (
  <>
    {/* Top-left */}
    <div className="absolute top-2 left-2 pointer-events-none select-none" style={{ color }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="0" y="0" width="3.5" height="3.5" />
        <rect x="3.5" y="0" width="3.5" height="3.5" />
        <rect x="7" y="0" width="3.5" height="3.5" />
        <rect x="0" y="3.5" width="3.5" height="3.5" />
        <rect x="0" y="7" width="3.5" height="3.5" />
        <rect x="3.5" y="3.5" width="3.5" height="3.5" opacity="0.35" />
      </svg>
    </div>
    {/* Top-right */}
    <div className="absolute top-2 right-2 pointer-events-none select-none" style={{ color }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="12.5" y="0" width="3.5" height="3.5" />
        <rect x="9" y="0" width="3.5" height="3.5" />
        <rect x="5.5" y="0" width="3.5" height="3.5" />
        <rect x="12.5" y="3.5" width="3.5" height="3.5" />
        <rect x="12.5" y="7" width="3.5" height="3.5" />
        <rect x="9" y="3.5" width="3.5" height="3.5" opacity="0.35" />
      </svg>
    </div>
    {/* Bottom-left */}
    <div className="absolute bottom-2 left-2 pointer-events-none select-none" style={{ color }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="0" y="12.5" width="3.5" height="3.5" />
        <rect x="3.5" y="12.5" width="3.5" height="3.5" />
        <rect x="7" y="12.5" width="3.5" height="3.5" />
        <rect x="0" y="9" width="3.5" height="3.5" />
        <rect x="0" y="5.5" width="3.5" height="3.5" />
        <rect x="3.5" y="9" width="3.5" height="3.5" opacity="0.35" />
      </svg>
    </div>
    {/* Bottom-right */}
    <div className="absolute bottom-2 right-2 pointer-events-none select-none" style={{ color }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="12.5" y="12.5" width="3.5" height="3.5" />
        <rect x="9" y="12.5" width="3.5" height="3.5" />
        <rect x="5.5" y="12.5" width="3.5" height="3.5" />
        <rect x="12.5" y="9" width="3.5" height="3.5" />
        <rect x="12.5" y="5.5" width="3.5" height="3.5" />
        <rect x="9" y="9" width="3.5" height="3.5" opacity="0.35" />
      </svg>
    </div>
  </>
);

export const PvpOptionsPanel = forwardRef<HTMLDivElement, PvpOptionsPanelProps>(
  function PvpOptionsPanel({ onFindMatch, onConnectRoom, dividerRef }, ref) {
    const [roomId, setRoomId] = useState<string>("");
    const [inputRoomId, setInputRoomId] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    // Generate 6-character random room code
    const handleGenerateRoom = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setRoomId(code);
    };

    // Copy room code to clipboard
    const handleCopy = async () => {
      if (!roomId) return;
      try {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy room code:", err);
      }
    };

    const handleConnect = () => {
      const code = inputRoomId.trim();
      if (!code) return;
      if (onConnectRoom) {
        onConnectRoom(code);
      }
    };

    return (
      <div
        ref={ref}
        className="w-full flex flex-col md:flex-row items-stretch justify-center gap-4 sm:gap-6 will-change-transform"
      >
        {/* CARD 1: MATCHMAKING */}
        <div
          data-pvp-card
          className="group relative flex-1 min-w-0 rounded-2xl bg-white/95 border-2 border-purple-200/90 shadow-[0_8px_30px_rgba(124,58,237,0.08)] p-5 sm:p-6 pt-7 sm:pt-8 flex flex-col justify-between backdrop-blur-xs will-change-transform"
        >
          {/* Cyber pixel accents */}
          <CyberCorners color="#9333ea" />

          {/* Top Circular Globe Badge */}
          <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-purple-500 shadow-md text-purple-600">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>

          {/* Header block */}
          <div className="text-center mt-1">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 leading-tight">
              MATCHMAKING
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
              Find a random player to battle with and test your skills.
            </p>
          </div>

          {/* Visual: Player Silhouettes with VS */}
          <div className="my-5 flex items-center justify-center gap-4 sm:gap-6">
            {/* Left Silhouette */}
            <div className="w-14 h-12 sm:w-16 sm:h-14 flex items-center justify-center">
              <svg viewBox="0 0 64 56" className="w-full h-full">
                <defs>
                  <linearGradient id="p1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="16" r="11" fill="url(#p1Grad)" />
                <path
                  d="M10 52 C10 35 21 30 32 30 C43 30 54 35 54 52 Z"
                  fill="url(#p1Grad)"
                />
              </svg>
            </div>

            {/* VS Pill Badge */}
            <div className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#581c87] text-[11px] sm:text-xs font-black tracking-widest border border-purple-200 shadow-xs">
              VS
            </div>

            {/* Right Silhouette */}
            <div className="w-14 h-12 sm:w-16 sm:h-14 flex items-center justify-center">
              <svg viewBox="0 0 64 56" className="w-full h-full">
                <defs>
                  <linearGradient id="p2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="16" r="11" fill="url(#p2Grad)" />
                <path
                  d="M10 52 C10 35 21 30 32 30 C43 30 54 35 54 52 Z"
                  fill="url(#p2Grad)"
                />
              </svg>
            </div>
          </div>

          {/* Action Button: Find Match */}
          <button
            type="button"
            onClick={onFindMatch}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-black tracking-widest text-xs sm:text-sm uppercase flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(124,58,237,0.38)] hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>FIND MATCH</span>
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current fill-none transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* MIDDLE OR DIVIDER */}
        <div
          ref={dividerRef}
          className="hidden md:flex flex-col items-center justify-center relative px-1 will-change-transform"
        >
          <div className="h-full w-px bg-slate-300" />
          <span className="absolute top-1/2 -translate-y-1/2 bg-[#eef2f8] px-2 py-0.5 text-[11px] font-black tracking-widest text-slate-500 uppercase rounded">
            OR
          </span>
        </div>

        {/* Mobile Divider */}
        <div className="flex md:hidden items-center justify-center gap-3 w-full my-1">
          <div className="h-px flex-1 bg-slate-300" />
          <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase">
            OR
          </span>
          <div className="h-px flex-1 bg-slate-300" />
        </div>

        {/* CARD 2: PLAY WITH FRIENDS */}
        <div
          data-pvp-card
          className="group relative flex-1 min-w-0 rounded-2xl bg-white/95 border-2 border-emerald-200/90 shadow-[0_8px_30px_rgba(16,185,129,0.08)] p-5 sm:p-6 pt-7 sm:pt-8 flex flex-col justify-between backdrop-blur-xs will-change-transform"
        >
          {/* Cyber pixel accents */}
          <CyberCorners color="#10b981" />

          {/* Top Circular Users Badge */}
          <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-emerald-500 shadow-md text-emerald-500">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          {/* Header block */}
          <div className="text-center mt-1">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 leading-tight">
              PLAY WITH FRIENDS
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
              Create a room and share the ID, or join an existing room.
            </p>
          </div>

          {/* Input & Display Row */}
          <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {/* YOUR ROOM ID Column */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 text-center sm:text-left">
                YOUR ROOM ID
              </span>
              <div className="flex items-center justify-between h-10 sm:h-11 bg-emerald-50/80 border border-emerald-300/80 rounded-xl px-3 shadow-inner">
                <span className="font-mono font-bold tracking-widest text-slate-800 text-xs sm:text-sm select-all">
                  {roomId || "-----"}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy room code"
                  disabled={!roomId}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    roomId
                      ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/70"
                      : "text-slate-400 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {copied ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ENTER ROOM ID Column */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 text-center sm:text-left">
                ENTER ROOM ID
              </span>
              <input
                type="text"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room ID..."
                maxLength={10}
                className="h-10 sm:h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs uppercase tracking-wider"
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Generate Room ID Button */}
            <button
              type="button"
              onClick={handleGenerateRoom}
              className="h-10 sm:h-11 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black tracking-wider text-[11px] sm:text-xs uppercase flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(16,185,129,0.32)] hover:brightness-105 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>GENERATE ROOM ID</span>
            </button>

            {/* Connect to Room ID Button */}
            <button
              type="button"
              onClick={handleConnect}
              className="h-10 sm:h-11 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black tracking-wider text-[11px] sm:text-xs uppercase flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:brightness-105 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>CONNECT TO ROOM ID</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PvpOptionsPanel.displayName = "PvpOptionsPanel";

export default PvpOptionsPanel;
