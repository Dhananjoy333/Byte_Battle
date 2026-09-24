export interface CharacterSpriteConfig {
    dir: string;
    prefix: 's' | 'r';
    frameCount: number;
}

export interface CharacterStats {
    power: number;
    accel: number;
    speed: number;
}

export interface CharacterConfig {
    id: string;
    name: string;
    hudName: string;
    role: string;
    title: string;
    avatarUrl: string;
    fullImage: string;
    description: string;
    stats: CharacterStats;
    sprite: CharacterSpriteConfig;
}
const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export const CHARACTERS: CharacterConfig[] = [
    {
        id: 'aurelia',
        name: 'Aurelia Veyne',
        hudName: 'AURELIA',
        role: 'Sprinter',
        title: 'SPRINTER // LIGHTNING PLAYMAKER',
        avatarUrl: `${IMAGEKIT_URL}/icons/aurelia.png`,
        fullImage: `${IMAGEKIT_URL}/char_portrait/aurelia.png`,
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
        sprite: {
            dir: `${IMAGEKIT_URL}/sprites/aurelia sprite`,
            prefix: 's',
            frameCount: 8,
        },
    },
    {
        id: 'raze',
        name: 'Raze',
        hudName: 'RAZE',
        role: 'Tactician',
        title: 'TACTICIAN // SURGICAL PRECISION',
        avatarUrl: `${IMAGEKIT_URL}/icons/raze.png`,
        fullImage: `${IMAGEKIT_URL}/char_portrait/raze.png`,
        description:
            'Calculates passing lanes with surgical precision and orchestrates high-tempo midfield transitions.',
        stats: { power: 7, accel: 8, speed: 10 },
        sprite: {
            dir: `${IMAGEKIT_URL}/sprites/raze sprite`,
            prefix: 'r',
            frameCount: 8,
        },
    },
    {
        id: 'kira',
        name: 'Kira Byte',
        hudName: 'KIRA',
        role: 'Striker',
        title: 'STRIKER // KINETIC POWERHOUSE',
        avatarUrl: `${IMAGEKIT_URL}/icons/kira.png`,
        fullImage: `${IMAGEKIT_URL}/char_portrait/kira.png`,
        description:
            'Unstoppable kinetic force capable of powering through deep defensive blocks with high-impact finishing.',
        stats: { power: 12, accel: 7, speed: 6 },
        sprite: {
            dir: `${IMAGEKIT_URL}/sprites/kira sprite`,
            prefix: 's',
            frameCount: 8,
        },
    },
    {
        id: 'lucien',
        name: 'Lucien Frostvale',
        hudName: 'LUCIEN',
        role: 'Sprinter',
        title: 'FROST // KINETIC STRATEGIST',
        avatarUrl: `${IMAGEKIT_URL}/icons/lucien.png`,
        fullImage: `${IMAGEKIT_URL}/char_portrait/lucien.png`,
        description:
            'A master of icy momentum and swift angles, turning defensive stops into breakneck counter-attacks.',
        stats: { power: 9, accel: 11, speed: 8 },
        sprite: {
            dir: `${IMAGEKIT_URL}/sprites/lucien sprite`,
            prefix: 'r',
            frameCount: 8,
        },
    },
    {
        id: 'raizen',
        name: 'Raizen',
        hudName: 'RAIZEN',
        role: 'Vanguard',
        title: 'VANGUARD // VOLTAGE SURGE',
        avatarUrl: `${IMAGEKIT_URL}/icons/raizen.png`,
        fullImage: `${IMAGEKIT_URL}/char_portrait/raizen.png`,
        description:
            'An electrified frontline powerhouse that overwhelms rivals with explosive bursts and raw voltage.',
        stats: { power: 10, accel: 9, speed: 9 },
        sprite: {
            dir: `${IMAGEKIT_URL}/sprites/raizen sprite`,
            prefix: 'r',
            frameCount: 8,
        },
    },
];

export const CHARACTERS_BY_ID: Record<string, CharacterConfig> = CHARACTERS.reduce(
    (acc, char) => {
        acc[char.id] = char;
        return acc;
    },
    {} as Record<string, CharacterConfig>
);

export function getCharacterById(id: string): CharacterConfig {
    return CHARACTERS_BY_ID[id] ?? CHARACTERS[0];
}

export function getDefaultOpponent(playerId: string): CharacterConfig {
    // Pick Kira by default, or Aurelia if player picked Kira, or first non-player character
    if (playerId !== 'kira') {
        return getCharacterById('kira');
    }
    return getCharacterById('aurelia');
}

export function getSpriteFrameUrl(char: CharacterConfig, frameIndex: number): string {
    const frame = Math.max(1, Math.min(char.sprite.frameCount, frameIndex));
    return `${char.sprite.dir}/${char.sprite.prefix}-${frame}.png`;
}
