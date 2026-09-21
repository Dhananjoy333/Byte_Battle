'use client';

import React, { useEffect, useRef } from 'react';
import { BannerMessageType } from '../types';

interface AnnouncerBannerProps {
    message: BannerMessageType;
    onComplete?: () => void;
}

export const AnnouncerBanner: React.FC<AnnouncerBannerProps> = ({ message, onComplete }) => {
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!message) return;

        // Auto-dismiss for terminal banners like KO, TIME_OVER, VICTORY if onComplete is supplied
        if (message === 'KO' || message === 'TIME_OVER' || message === 'VICTORY' || message === 'DOUBLE_KO') {
            const timer = setTimeout(() => {
                onCompleteRef.current?.();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    const renderContent = () => {
        switch (message) {
            case 'ROUND_1':
                return (
                    <div className="flex flex-col items-center">
                        <div className="px-8 sm:px-12 py-3 sm:py-4 bg-black/80 backdrop-blur-md border-y-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.7)] flex items-center justify-center rounded-sm">
                            <span className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)] font-mono">
                                ROUND 1
                            </span>
                        </div>
                    </div>
                );
            case 'ROUND_2':
                return (
                    <div className="flex flex-col items-center">
                        <div className="px-8 sm:px-12 py-3 sm:py-4 bg-black/80 backdrop-blur-md border-y-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.7)] flex items-center justify-center rounded-sm">
                            <span className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)] font-mono">
                                ROUND 2
                            </span>
                        </div>
                    </div>
                );
            case 'FINAL_ROUND':
                return (
                    <div className="flex flex-col items-center">
                        <div className="px-8 sm:px-12 py-3 sm:py-4 bg-black/80 backdrop-blur-md border-y-4 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.7)] flex items-center justify-center rounded-sm">
                            <span className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-orange-500 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)] font-mono">
                                FINAL ROUND
                            </span>
                        </div>
                    </div>
                );
            case 'FIGHT':
                return (
                    <div className="flex flex-col items-center">
                        <div className="px-10 sm:px-16 py-3 sm:py-5 bg-black/85 backdrop-blur-md border-y-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.85)] flex items-center justify-center rounded-sm">
                            <span
                                className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 drop-shadow-[0_8px_20px_rgba(0,0,0,1)] font-mono"
                                style={{
                                    WebkitTextStroke: '2px #000000',
                                    filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 1))',
                                }}
                            >
                                FIGHT!
                            </span>
                        </div>
                    </div>
                );
            case 'KO':
                return (
                    <div className="flex flex-col items-center">
                        <span
                            className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-red-500 to-red-700 drop-shadow-[0_10px_20px_rgba(0,0,0,1)] animate-bounce"
                            style={{
                                WebkitTextStroke: '3px #000000',
                                filter: 'drop-shadow(0 0 35px rgba(220, 38, 38, 1))',
                            }}
                        >
                            K.O.!
                        </span>
                    </div>
                );
            case 'DOUBLE_KO':
                return (
                    <div className="flex flex-col items-center">
                        <span className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-widest text-red-500 drop-shadow-[0_6px_12px_rgba(0,0,0,1)]">
                            DOUBLE K.O.
                        </span>
                    </div>
                );
            case 'TIME_OVER':
                return (
                    <div className="flex flex-col items-center">
                        <span className="text-4xl sm:text-6xl md:text-7xl font-black tracking-widest text-amber-400 drop-shadow-[0_6px_12px_rgba(0,0,0,1)]">
                            TIME OVER
                        </span>
                    </div>
                );
            case 'VICTORY':
                return (
                    <div className="flex flex-col items-center">
                        <span
                            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-[0_8px_16px_rgba(0,0,0,1)]"
                            style={{
                                WebkitTextStroke: '2px #000',
                                filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.8))',
                            }}
                        >
                            VICTORY!
                        </span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none select-none">
            <div className="animate-banner-in">
                {renderContent()}
            </div>
            <style jsx>{`
                @keyframes bannerIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.65) translateY(12px);
                    }
                    25% {
                        opacity: 1;
                        transform: scale(1.05) translateY(0);
                    }
                    35% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    88% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-banner-in {
                    animation: bannerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

