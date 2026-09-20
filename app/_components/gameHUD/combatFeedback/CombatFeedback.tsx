'use client';

import React from 'react';
import { AnnouncerBanner } from './AnnouncerBanner';
import { ComboCounter } from './ComboCounter';
import { BannerMessageType, FloatingTextItem } from '../types';

interface CombatFeedbackProps {
    bannerMessage: BannerMessageType;
    onBannerComplete?: () => void;
    comboCount: number;
    floatingTexts: FloatingTextItem[];
}

export const CombatFeedback: React.FC<CombatFeedbackProps> = ({
    bannerMessage,
    onBannerComplete,
    comboCount,
    floatingTexts,
}) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {/* Ephemeral Announcer Banner */}
            <AnnouncerBanner message={bannerMessage} onComplete={onBannerComplete} />

            {/* Floating Combo and Damage Numbers */}
            <ComboCounter comboCount={comboCount} floatingTexts={floatingTexts} />
        </div>
    );
};
