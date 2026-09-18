import React from 'react';
import Image from 'next/image';

interface CharacterStageProps {
    characterImage: string;
    characterName: string;
    ballImage?: string;
    onPlay?: () => void;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
                                                                  characterImage,
                                                                  characterName,
                                                                  ballImage = '/assets/soccer-ball.png',
                                                                  onPlay,
                                                              }) => {
    return (
        <div className="relative flex flex-col items-center justify-end w-full h-[88vh] max-h-[920px] select-none">
            {/* Background Stage Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400/25 rounded-full blur-[140px] pointer-events-none" />

            {/* Main Character PNG Cutout */}
            <div className="relative z-10 w-[640px] h-[78vh] max-h-[800px] pointer-events-none transition-transform duration-500 ease-out hover:scale-[1.02]">
                <Image
                    src={characterImage}
                    alt={characterName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-contain object-bottom drop-shadow-[0_30px_45px_rgba(0,0,0,0.65)]"
                />
            </div>

            {/* Layered 3D-Look Stage Podium */}
            <div className="relative -mt-24 z-0 flex flex-col items-center">
                {/* Top surface disc */}
                <div className="w-[520px] h-[100px] rounded-[100%] bg-gradient-to-b from-white via-slate-100 to-slate-300 shadow-[0_15px_35px_rgba(0,0,0,0.45)] border-t border-white/80" />

                {/* Cylinder depth bevel */}
                <div className="w-[516px] h-16 -mt-12 rounded-b-[100%] bg-gradient-to-b from-slate-400 to-slate-700 shadow-2xl" />

                {/* Floor contact shadow */}
                <div className="absolute -bottom-6 w-[620px] h-20 bg-black/50 blur-2xl rounded-[100%] pointer-events-none" />
            </div>

            {/* "Let's Play!" Primary CTA Button */}
            <div className="relative z-30 -mt-8">
                <button
                    type="button"
                    onClick={onPlay}
                    className="px-14 py-4 rounded-2xl bg-gradient-to-r from-[#ff4767] to-[#ff3358] hover:from-[#e63a58] hover:to-[#e62b4e] active:scale-95 text-white font-extrabold text-base tracking-wider shadow-[0_12px_30px_rgba(255,71,103,0.55)] transition-all duration-200"
                >
                    Let&apos;s Play!
                </button>
            </div>
        </div>
    );
};