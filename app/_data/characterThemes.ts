export interface CharacterTheme {
    id: string;
    name: string;
    colorName: 'blueish' | 'pinkish' | 'white' | 'yellow' | 'red';
    // Color backgrounds per user specifications
    bgGradient: string;
    glowColor: string;
    accentColor: string;
    groundGlow: string;
    // Prepared for future image support ('later i will handle those with images')
    bgImageUrl?: string;
    charImageUrl: string;
}
const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export const CHARACTER_THEMES: Record<string, CharacterTheme> = {
    aurelia: {
        id: 'aurelia',
        name: 'Aurelia Veyne',
        colorName: 'blueish',
        bgGradient: 'radial-gradient(ellipse 90% 80% at 50% 35%, #0d2857 0%, #061533 45%, #020817 85%, #01040a 100%)',
        glowColor: 'rgba(14, 165, 233, 0.45)',
        accentColor: '#38bdf8',
        groundGlow: 'rgba(56, 189, 248, 0.22)',
        charImageUrl: '/selec_char/aurelia.png',
    },
    kira: {
        id: 'kira',
        name: 'Kira Byte',
        colorName: 'pinkish',
        bgGradient: 'radial-gradient(ellipse 90% 80% at 50% 35%, #5a0d3e 0%, #2f0621 45%, #14020e 85%, #070005 100%)',
        glowColor: 'rgba(244, 63, 94, 0.48)',
        accentColor: '#f43f5e',
        groundGlow: 'rgba(244, 63, 94, 0.22)',
        charImageUrl: '/selec_char/kira.png',
    },
    lucien: {
        id: 'lucien',
        name: 'Lucien Frostvale',
        colorName: 'white',
        bgGradient: 'radial-gradient(ellipse 90% 80% at 50% 35%, #384252 0%, #1e2633 45%, #0f141d 85%, #05070a 100%)',
        glowColor: 'rgba(255, 255, 255, 0.55)',
        accentColor: '#ffffff',
        groundGlow: 'rgba(255, 255, 255, 0.24)',
        charImageUrl: '/selec_char/lucien.png',
    },
    raizen: {
        id: 'raizen',
        name: 'Raizen',
        colorName: 'yellow',
        bgGradient: 'radial-gradient(ellipse 90% 80% at 50% 35%, #594408 0%, #2f2303 45%, #130e01 85%, #060400 100%)',
        glowColor: 'rgba(234, 179, 8, 0.48)',
        accentColor: '#eab308',
        groundGlow: 'rgba(234, 179, 8, 0.22)',
        charImageUrl: '/selec_char/raizen.png',
    },
    raze: {
        id: 'raze',
        name: 'Raze',
        colorName: 'red',
        bgGradient: 'radial-gradient(ellipse 90% 80% at 50% 35%, #5c0f16 0%, #31060b 45%, #140204 85%, #060001 100%)',
        glowColor: 'rgba(239, 68, 68, 0.48)',
        accentColor: '#ef4444',
        groundGlow: 'rgba(239, 68, 68, 0.22)',
        charImageUrl: '/selec_char/raze.png',
    },
};

export const GROUND_IMAGE_URL = `${IMAGEKIT_URL}/selec_char/ground.png`;

export function getCharacterTheme(id: string): CharacterTheme {
    return CHARACTER_THEMES[id] ?? CHARACTER_THEMES['aurelia'];
}
