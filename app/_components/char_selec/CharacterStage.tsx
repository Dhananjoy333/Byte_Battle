import React from 'react';
import Image from 'next/image';
import { Podium } from './Podium';

interface CharacterStageProps {
    characterId: string;
    characterImage: string;
    characterName: string;
    ballImage?: string;
    onPlay?: () => void;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
                                                                  characterId,
                                                                  characterImage,
                                                                  characterName,
                                                                  onPlay,
                                                              }) => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full select-none">

            {/* Background Stage Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-130 h-130 bg-sky-400/20 rounded-full blur-[140px] pointer-events-none" />

            {/* Character PNG Cutout */}
            <div className="relative z-10 w-120 md:w-130 translate-y-7.5 h-[48vh] max-h-125 pointer-events-none flex items-end justify-center">
                <div key={characterId} className="relative w-full h-full animate-in fade-in duration-300">
                    <Image
                        src={characterImage}
                        alt={characterName}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className="object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
                    />
                </div>
            </div>

            {/* 3D Rotating Mesh Podium Stage */}
            <div className="relative z-0 -mt-6 md:-mt-10 flex flex-col items-center">
                <Podium characterId={characterId} />

                {/* Grounding contact shadow right under character base on podium deck */}
                <div className="absolute top-8 w-56 h-5 bg-black/50 blur-md rounded-full pointer-events-none -z-5" />
            </div>

            {/* Primary CTA Button with generous breathing room */}
            <div className="relative z-30 mt-6 md:mt-8">
                <button
                    type="button"
                    onClick={onPlay}
                    className="px-14 py-4 rounded-2xl bg-linear-to-r from-[#ff4767] to-[#ff3358] hover:from-[#e63a58] hover:to-[#e62b4e] active:scale-95 text-white font-extrabold text-base tracking-wider shadow-[0_12px_30px_rgba(255,71,103,0.55)] transition-all duration-200 cursor-pointer"
                >
                    Let&apos;s Play!
                </button>
            </div>

        </div>
    );
};