'use client';

import React, { useEffect, useState } from 'react';
import { BannerMessageType } from '../types';

interface AnnouncerBannerProps {
    message: BannerMessageType;
    onComplete?: () => void;
}

export const AnnouncerBanner: React.FC<AnnouncerBannerProps> = ({ message, onComplete }) => {
    const [visible, setVisible] = useState(!!message);
    const [animClass, setAnimClass] = useState('scale-100 opacity-100');

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);
        setAnimClass('scale-50 opacity-0 translate-y-4');

        const entranceTimer = setTimeout(() => {
            setAnimClass('scale-105 opacity-100 translate-y-0');
        }, 30);

        const holdTimer = setTimeout(() => {
            setAnimClass('scale-100 opacity-100');
        }, 300);

        const exitTimer = setTimeout(() => {
            setAnimClass('scale-125 opacity-0 -translate-y-4');
        }, 1800);

        const finishTimer = setTimeout(() => {
            setVisible(false);
            onComplete?.();
        }, 2200);

        return () => {
            clearTimeout(entranceTimer);
            clearTimeout(holdTimer);
            clearTimeout(exitTimer);
            clearTimeout(finishTimer);
        };
    }, [message, onComplete]);

    if (!visible || !message) return null;

    const renderContent = () => {
        switch (message) {
            case 'ROUND_1':
                return (
                    <div className="flex flex-col items-center">
                        <span className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-widest text-slate-100 uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,1)] font-mono">
                            ROUND 1
                        </span>
                    </div>
                );
            case 'ROUND_2':
                return (
                    <div className="flex flex-col items-center">
                        <span className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-widest text-slate-100 uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,1)] font-mono">
                            ROUND 2
                        </span>
                    </div>
                );
            case 'FINAL_ROUND':
                return (
                    <div className="flex flex-col items-center">
                        <span className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-widest text-amber-400 uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,1)] font-mono">
                            FINAL ROUND
                        </span>
                    </div>
                );
            case 'FIGHT':
                return (
                    <div className="flex flex-col items-center">
                        <span className="text-base sm:text-xl md:text-2xl font-black tracking-widest text-neutral-200 uppercase font-mono mb-1">
                            ROUND 1
                        </span>
                        <div className="relative">
                            <span
                                className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 drop-shadow-[0_8px_16px_rgba(0,0,0,1)]"
                                style={{
                                    WebkitTextStroke: '2px #000000',
                                    filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.9))',
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
            <div
                className={`transition-all duration-300 ease-out transform ${animClass}`}
            >
                {renderContent()}
            </div>
        </div>
    );
};
