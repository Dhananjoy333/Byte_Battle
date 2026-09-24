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

export const CHARACTERS: CharacterConfig[] = [
    {
        id: 'aurelia',
        name: 'Aurelia Veyne',
        hudName: 'AURELIA',
        role: 'Sprinter',
        title: 'SPRINTER // LIGHTNING PLAYMAKER',
        avatarUrl: '/icons/aurelia.png',
        fullImage: '/char_portrait/aurelia.png',
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
        sprite: {
            dir: '/sprites/aurelia sprite',
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
        avatarUrl: '/icons/raze.png',
        fullImage: '/char_portrait/raze.png',
        description:
            'Calculates passing lanes with surgical precision and orchestrates high-tempo midfield transitions.',
        stats: { power: 7, accel: 8, speed: 10 },
        sprite: {
            dir: '/sprites/raze sprite',
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
        avatarUrl: '/icons/kira.png',
        fullImage: '/char_portrait/kira.png',
        description:
            'Unstoppable kinetic force capable of powering through deep defensive blocks with high-impact finishing.',
        stats: { power: 12, accel: 7, speed: 6 },
        sprite: {
            dir: '/sprites/kira sprite',
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
        avatarUrl: '/icons/lucien.png',
        fullImage: '/char_portrait/lucien.png',
        description:
            'A master of icy momentum and swift angles, turning defensive stops into breakneck counter-attacks.',
        stats: { power: 9, accel: 11, speed: 8 },
        sprite: {
            dir: '/sprites/lucien sprite',
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
        avatarUrl: '/icons/raizen.png',
        fullImage: '/char_portrait/raizen.png',
        description:
            'An electrified frontline powerhouse that overwhelms rivals with explosive bursts and raw voltage.',
        stats: { power: 10, accel: 9, speed: 9 },
        sprite: {
            dir: '/sprites/raizen sprite',
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
