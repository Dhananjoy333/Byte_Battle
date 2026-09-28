'use client';

import { useState, useEffect } from 'react';

export type ScreenTier = 'mobile' | 'largeMobile' | 'tablet' | 'laptop' | 'desktop';

export interface StatRingSizes {
    power: number;
    accel: number;
    speed: number;
    strokePower: number;
    strokeAccel: number;
    strokeSpeed: number;
}

export interface AvatarBubbleSize {
    active: number;
    inactive: number;
}

export interface ScreenTierInfo {
    tier: ScreenTier;
    vw: number;
    vh: number;
    isMobile: boolean;       // < 480
    isLargeMobile: boolean;  // 480px - 639px
    isTablet: boolean;       // 640px - 1023px
    isLaptop: boolean;       // 1024px - 1535px
    isDesktop: boolean;      // >= 1536px
    isCompact: boolean;      // < 1024px (mobile or tablet)
    dockX: number;
    dockY: number;
    statRingSizes: StatRingSizes;
    avatarBubbleSize: AvatarBubbleSize;
}

/**
 * Helper to calculate responsive docking coordinates based on 5 screen tiers
 * (matching ModeSelection logic provided in requirements)
 */
export const getDockOffsets = (vw: number) => {
    if (vw < 480) {
        // Mobile (around 320px - 480px)
        const dockX = Math.round(Math.min(76, Math.max(66, vw * 0.23)));
        return { dockX, dockY: -35 };
    }
    if (vw < 640) {
        // Large mobile (480px - 640px)
        return { dockX: Math.round(vw * 0.22), dockY: -30 };
    }
    if (vw < 1024) {
        // Tablet (around 768px)
        return { dockX: 140, dockY: -25 };
    }
    if (vw < 1536) {
        // Laptop (around 1280px, e.g. MacBook Air 1280px-1440px)
        return { dockX: 205, dockY: -35 };
    }
    // Desktop 1440p+ / 1536px+
    return { dockX: 285, dockY: -20 };
};

/**
 * Computes full tier information and dimensional parameters for a given viewport width and height
 */
export const computeScreenTierInfo = (vw: number, vh: number): ScreenTierInfo => {
    const { dockX, dockY } = getDockOffsets(vw);

    if (vw < 480) {
        return {
            tier: 'mobile',
            vw,
            vh,
            isMobile: true,
            isLargeMobile: false,
            isTablet: false,
            isLaptop: false,
            isDesktop: false,
            isCompact: true,
            dockX,
            dockY,
            statRingSizes: {
                power: 52,
                accel: 64,
                speed: 52,
                strokePower: 6,
                strokeAccel: 7,
                strokeSpeed: 6,
            },
            avatarBubbleSize: {
                active: 56,
                inactive: 44,
            },
        };
    }

    if (vw < 640) {
        return {
            tier: 'largeMobile',
            vw,
            vh,
            isMobile: false,
            isLargeMobile: true,
            isTablet: false,
            isLaptop: false,
            isDesktop: false,
            isCompact: true,
            dockX,
            dockY,
            statRingSizes: {
                power: 60,
                accel: 74,
                speed: 60,
                strokePower: 7,
                strokeAccel: 8,
                strokeSpeed: 7,
            },
            avatarBubbleSize: {
                active: 64,
                inactive: 50,
            },
        };
    }

    if (vw < 1024) {
        return {
            tier: 'tablet',
            vw,
            vh,
            isMobile: false,
            isLargeMobile: false,
            isTablet: true,
            isLaptop: false,
            isDesktop: false,
            isCompact: true,
            dockX,
            dockY,
            statRingSizes: {
                power: 70,
                accel: 88,
                speed: 70,
                strokePower: 8,
                strokeAccel: 9,
                strokeSpeed: 8,
            },
            avatarBubbleSize: {
                active: 72,
                inactive: 56,
            },
        };
    }

    if (vw < 1536) {
        return {
            tier: 'laptop',
            vw,
            vh,
            isMobile: false,
            isLargeMobile: false,
            isTablet: false,
            isLaptop: true,
            isDesktop: false,
            isCompact: false,
            dockX,
            dockY,
            statRingSizes: {
                power: 85,
                accel: 115,
                speed: 85,
                strokePower: 9,
                strokeAccel: 12,
                strokeSpeed: 9,
            },
            avatarBubbleSize: {
                active: 115,
                inactive: 72,
            },
        };
    }

    return {
        tier: 'desktop',
        vw,
        vh,
        isMobile: false,
        isLargeMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: true,
        isCompact: false,
        dockX,
        dockY,
        statRingSizes: {
            power: 110,
            accel: 150,
            speed: 110,
            strokePower: 11,
            strokeAccel: 14,
            strokeSpeed: 11,
        },
        avatarBubbleSize: {
            active: 140,
            inactive: 84,
        },
    };
};

/**
 * React hook that dynamically detects screen tier across 5 breakpoints
 */
export function useScreenTier(): ScreenTierInfo {
    // SSR fallback to desktop
    const [info, setInfo] = useState<ScreenTierInfo>(() => computeScreenTierInfo(1920, 1080));

    useEffect(() => {
        const update = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            setInfo(computeScreenTierInfo(vw, vh));
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return info;
}
