export interface FighterState {
    id: string;
    name: string;
    title: string;
    portraitUrl: string;
    currentHp: number;
    maxHp: number;
    roundsWon: number;
    maxRounds: number;
    isHurt?: boolean;
    spriteUrl?: string;
}

export type BannerMessageType =
    | 'ROUND_1'
    | 'ROUND_2'
    | 'FINAL_ROUND'
    | 'FIGHT'
    | 'KO'
    | 'DOUBLE_KO'
    | 'TIME_OVER'
    | 'VICTORY'
    | null;

export interface FloatingTextItem {
    id: string;
    text: string;
    type: 'damage' | 'hit' | 'critical' | 'streak' | 'bonus';
    side: 'left' | 'right' | 'center';
    x?: number;
    y?: number;
}

export interface TriviaOption {
    key: 'A' | 'B' | 'C' | 'D';
    label: string;
    text: string;
}

export interface TriviaQuestion {
    id: string;
    category: string;
    prompt: string;
    codeSnippet?: string;
    options: TriviaOption[];
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation?: string;
}

export type ActionType = 'light' | 'heavy' | 'ult';

export interface ActionAbility {
    type: ActionType;
    label: string;
    hotkey: string;
    damage: number;
    cooldownTotal: number; // in seconds
    currentCooldown: number; // remaining seconds
    superCost: number; // 0 for light/heavy, 100 for ult
    isReady: boolean;
    themeColor: 'blue' | 'orange' | 'red';
}

export interface SuperMeterState {
    value: number; // 0 - 100
    max: number; // 100
    isFull: boolean;
}
