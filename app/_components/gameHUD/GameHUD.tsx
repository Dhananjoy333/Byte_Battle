'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TopBar } from './topBar/TopBar';
import { CombatFeedback } from './combatFeedback/CombatFeedback';
import { ControlDeck } from './controlDeck/ControlDeck';
import { soundFx } from './audioSynth';
import { useGameStore } from '@/app/_store/useGameStore';
import {
    CHARACTERS,
    getCharacterById,
    getSpriteFrameUrl,
} from '@/app/_data/characters';
import {
    FighterState,
    TriviaQuestion,
    ActionAbility,
    SuperMeterState,
    FloatingTextItem,
    BannerMessageType,
    ActionType,
} from './types';

const INITIAL_QUESTIONS: TriviaQuestion[] = [
    {
        id: 'q1',
        category: 'ALGORITHMS // SEARCH',
        prompt: 'What is the worst-case time complexity of Binary Search on a sorted array?',
        options: [
            { key: 'A', label: 'A', text: 'O(1)' },
            { key: 'B', label: 'B', text: 'O(log n)' },
            { key: 'C', label: 'C', text: 'O(n)' },
            { key: 'D', label: 'D', text: 'O(n log n)' },
        ],
        correctAnswer: 'B',
    },
    {
        id: 'q2',
        category: 'JAVASCRIPT // CONCURRENCY',
        prompt: 'Where are resolved Promise callbacks placed before execution?',
        codeSnippet: 'Promise.resolve().then(() => console.log("Strike!"));',
        options: [
            { key: 'A', label: 'A', text: 'Microtask Queue' },
            { key: 'B', label: 'B', text: 'Macrotask Queue' },
            { key: 'C', label: 'C', text: 'Thread Pool' },
            { key: 'D', label: 'D', text: 'Render Queue' },
        ],
        correctAnswer: 'A',
    },
    {
        id: 'q3',
        category: 'DATA STRUCTURES // TREES',
        prompt: 'Which self-balancing binary search tree maintains a height difference of at most 1?',
        options: [
            { key: 'A', label: 'A', text: 'Red-Black Tree' },
            { key: 'B', label: 'B', text: 'AVL Tree' },
            { key: 'C', label: 'C', text: 'B-Tree' },
            { key: 'D', label: 'D', text: 'Splay Tree' },
        ],
        correctAnswer: 'B',
    },
    {
        id: 'q4',
        category: 'NETWORKING // PROTOCOLS',
        prompt: 'In the TCP 3-way handshake, what is sent back by the server in step 2?',
        options: [
            { key: 'A', label: 'A', text: 'ACK only' },
            { key: 'B', label: 'B', text: 'SYN only' },
            { key: 'C', label: 'C', text: 'SYN-ACK' },
            { key: 'D', label: 'D', text: 'RST' },
        ],
        correctAnswer: 'C',
    },
];

export const GameHUD: React.FC = () => {
    const { selectedCharacterId, opponentCharacterId, setSelectedCharacter } = useGameStore();

    // Check optional URL query param override on mount (e.g. ?char=lucien or ?player=raizen)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const queryChar = params.get('char') || params.get('player');
            if (queryChar && CHARACTERS.some((c) => c.id === queryChar)) {
                setSelectedCharacter(queryChar);
            }
        }
    }, [setSelectedCharacter]);

    const playerConfig = getCharacterById(selectedCharacterId);
    const opponentConfig = getCharacterById(opponentCharacterId);

    // Fighters State
    const [player, setPlayer] = useState<FighterState>(() => ({
        id: playerConfig.id,
        name: playerConfig.hudName,
        title: playerConfig.title,
        portraitUrl: playerConfig.avatarUrl,
        currentHp: 100,
        maxHp: 100,
        roundsWon: 1,
        maxRounds: 2,
        isHurt: false,
    }));

    const [opponent, setOpponent] = useState<FighterState>(() => ({
        id: opponentConfig.id,
        name: opponentConfig.hudName,
        title: opponentConfig.title,
        portraitUrl: opponentConfig.avatarUrl,
        currentHp: 100,
        maxHp: 100,
        roundsWon: 0,
        maxRounds: 2,
        isHurt: false,
    }));

    // Update fighter metadata if active fighter configs change
    useEffect(() => {
        setPlayer((prev) => ({
            ...prev,
            id: playerConfig.id,
            name: playerConfig.hudName,
            title: playerConfig.title,
            portraitUrl: playerConfig.avatarUrl,
        }));
    }, [playerConfig]);

    useEffect(() => {
        setOpponent((prev) => ({
            ...prev,
            id: opponentConfig.id,
            name: opponentConfig.hudName,
            title: opponentConfig.title,
            portraitUrl: opponentConfig.avatarUrl,
        }));
    }, [opponentConfig]);

    // Sprite Animation State (8-frame attack cycle for active character)
    const [playerFrame, setPlayerFrame] = useState<number>(1);
    const [isPlayerAttacking, setIsPlayerAttacking] = useState<boolean>(false);
    const attackAnimTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Preload sprite frames for current fighters so animation plays smoothly without flicker
    useEffect(() => {
        if (typeof window !== 'undefined') {
            for (let i = 1; i <= playerConfig.sprite.frameCount; i++) {
                const img = new window.Image();
                img.src = getSpriteFrameUrl(playerConfig, i);
            }
            for (let i = 1; i <= opponentConfig.sprite.frameCount; i++) {
                const img = new window.Image();
                img.src = getSpriteFrameUrl(opponentConfig, i);
            }
        }
        return () => {
            if (attackAnimTimerRef.current) {
                clearInterval(attackAnimTimerRef.current);
            }
        };
    }, [playerConfig, opponentConfig]);

    // Match Timer State
    const [timeLeft, setTimeLeft] = useState<number>(99);
    const [isTimeOver, setIsTimeOver] = useState<boolean>(false);

    // Announcer Banner & Feedback
    const [bannerMessage, setBannerMessage] = useState<BannerMessageType>('ROUND_1');
    const [comboCount, setComboCount] = useState<number>(0);
    const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
    const [screenShake, setScreenShake] = useState<boolean>(false);
    const [screenFlash, setScreenFlash] = useState<boolean>(false);

    // Super Meter (0 to 100)
    const [superMeter, setSuperMeter] = useState<SuperMeterState>({
        value: 35,
        max: 100,
        isFull: false,
    });

    // Action Abilities with cooldown & action point costs (Light: 1P, Heavy: 2P, Ult: 5P)
    const [abilities, setAbilities] = useState<ActionAbility[]>([
        {
            type: 'light',
            label: 'LIGHT',
            hotkey: 'Q',
            damage: 12,
            cooldownTotal: 2.0,
            currentCooldown: 0,
            superCost: 0,
            pointCost: 1,
            isReady: true,
            themeColor: 'blue',
        },
        {
            type: 'heavy',
            label: 'HEAVY',
            hotkey: 'W',
            damage: 26,
            cooldownTotal: 4.5,
            currentCooldown: 0,
            superCost: 0,
            pointCost: 2,
            isReady: true,
            themeColor: 'orange',
        },
        {
            type: 'ult',
            label: 'ULT',
            hotkey: 'E',
            damage: 55,
            cooldownTotal: 1.0,
            currentCooldown: 0,
            superCost: 100,
            pointCost: 5,
            isReady: false,
            themeColor: 'red',
        },
    ]);

    // Action Points Counter (Earn 1 on correct answer, lose 1 on wrong answer, consumed on attack)
    const [actionPoints, setActionPoints] = useState<number>(0);

    // Question Panel State
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
    const [questionTimer, setQuestionTimer] = useState<number>(100);
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);

    const activeQuestion = INITIAL_QUESTIONS[currentQuestionIdx % INITIAL_QUESTIONS.length];

    // Helper: Add floating combat text
    const addFloatingText = useCallback(
        (text: string, type: 'damage' | 'hit' | 'critical' | 'streak' | 'bonus', side: 'left' | 'right' | 'center') => {
            const newItem: FloatingTextItem = {
                id: `${Date.now()}-${Math.random()}`,
                text,
                type,
                side,
            };
            setFloatingTexts((prev) => [...prev, newItem]);
            setTimeout(() => {
                setFloatingTexts((prev) => prev.filter((item) => item.id !== newItem.id));
            }, 800);
        },
        []
    );

    // Match Active State (Controls & timers start only after Round 1 -> Fight finishes)
    const [isMatchStarted, setIsMatchStarted] = useState<boolean>(false);
    const introTimersRef = useRef<NodeJS.Timeout[]>([]);

    const clearIntroTimers = useCallback(() => {
        introTimersRef.current.forEach((t) => clearTimeout(t));
        introTimersRef.current = [];
    }, []);

    // Initial Match Announcement Sequence: ROUND 1 -> FIGHT -> Match Begins (Zero flicker)
    const startMatchSequence = useCallback(() => {
        clearIntroTimers();
        setIsMatchStarted(false);
        setBannerMessage('ROUND_1');
        soundFx.playAnnouncerStinger();

        const t1 = setTimeout(() => {
            setBannerMessage('FIGHT');
            soundFx.playAnnouncerStinger();
        }, 1300);

        const t2 = setTimeout(() => {
            setBannerMessage(null);
            setIsMatchStarted(true);
        }, 2500);

        introTimersRef.current = [t1, t2];
    }, [clearIntroTimers]);

    useEffect(() => {
        startMatchSequence();
        return () => {
            clearIntroTimers();
        };
    }, [startMatchSequence, clearIntroTimers]);

    // Match Timer Countdown (every 1 second, only when match is active)
    useEffect(() => {
        if (!isMatchStarted || timeLeft <= 0 || isTimeOver) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsTimeOver(true);
                    setBannerMessage('TIME_OVER');
                    soundFx.playWrong();
                    return 0;
                }
                if (prev <= 10) {
                    soundFx.playTick();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isMatchStarted, timeLeft, isTimeOver]);

    // Action Cooldown Clock (100ms interval tick)
    useEffect(() => {
        const interval = setInterval(() => {
            setAbilities((prev) =>
                prev.map((ability) => {
                    if (ability.currentCooldown <= 0) return ability;
                    const nextCd = Math.max(0, ability.currentCooldown - 0.1);
                    return {
                        ...ability,
                        currentCooldown: nextCd,
                    };
                })
            );
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Update Ultimate Ready State when Super Meter Changes
    useEffect(() => {
        const isUltReady = superMeter.value >= 100;
        setAbilities((prev) =>
            prev.map((ability) => {
                if (ability.type === 'ult') {
                    return {
                        ...ability,
                        isReady: isUltReady,
                    };
                }
                return ability;
            })
        );
    }, [superMeter.value]);

    // Question Turn Timer tick (only when match is active)
    useEffect(() => {
        if (!isMatchStarted || isAnswered) return;

        const interval = setInterval(() => {
            setQuestionTimer((prev) => {
                if (prev <= 0) {
                    // Turn expired without answering
                    handleAnswerSelect(null);
                    return 0;
                }
                return prev - 1.2;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isMatchStarted, isAnswered]);

    // Execute Attacks (Sprite animation on Q, W, E, consumes action points and timer cooldown)
    const triggerAttack = useCallback(
        (type: ActionType) => {
            if (!isMatchStarted) return;
            const targetAbility = abilities.find((a) => a.type === type);
            if (!targetAbility || targetAbility.currentCooldown > 0) return;

            // Check if player has enough action points
            if (actionPoints < targetAbility.pointCost) {
                soundFx.playWrong();
                addFloatingText(
                    `NEED ${targetAbility.pointCost} PT${targetAbility.pointCost > 1 ? 'S' : ''}!`,
                    'damage',
                    'left'
                );
                return;
            }

            if (type === 'ult' && superMeter.value < 100) return;

            soundFx.playHit(type);

            // Deduct Action Points (Light: 1, Heavy: 2, Ult: 5)
            setActionPoints((prev) => Math.max(0, prev - targetAbility.pointCost));
            addFloatingText(`-${targetAbility.pointCost} PT`, 'hit', 'left');

            // Animate active character's attack sprite frames (e.g. s-1..s-8 or r-1..r-8)
            if (attackAnimTimerRef.current) {
                clearInterval(attackAnimTimerRef.current);
                attackAnimTimerRef.current = null;
            }
            setIsPlayerAttacking(true);
            setPlayerFrame(1);

            let currentFrame = 1;
            const maxFrames = playerConfig.sprite.frameCount;
            const frameSpeed = type === 'light' ? 50 : type === 'heavy' ? 65 : 75;

            attackAnimTimerRef.current = setInterval(() => {
                currentFrame++;
                if (currentFrame <= maxFrames) {
                    setPlayerFrame(currentFrame);
                } else {
                    if (attackAnimTimerRef.current) {
                        clearInterval(attackAnimTimerRef.current);
                        attackAnimTimerRef.current = null;
                    }
                    setPlayerFrame(1);
                    setIsPlayerAttacking(false);
                }
            }, frameSpeed);

            // Screen effects
            if (type === 'ult') {
                setScreenFlash(true);
                setScreenShake(true);
                setTimeout(() => setScreenFlash(false), 200);
                setTimeout(() => setScreenShake(false), 600);
            } else {
                setScreenShake(true);
                setTimeout(() => setScreenShake(false), 250);
            }

            // Put ability on cooldown
            setAbilities((prev) =>
                prev.map((a) =>
                    a.type === type ? { ...a, currentCooldown: a.cooldownTotal } : a
                )
            );

            // Calculate Super Meter Gain/Expenditure
            if (type === 'ult') {
                setSuperMeter({ value: 0, max: 100, isFull: false });
            } else {
                setSuperMeter((prev) => {
                    const nextVal = Math.min(100, prev.value + (type === 'heavy' ? 20 : 10));
                    if (nextVal >= 100 && prev.value < 100) {
                        soundFx.playSuperReady();
                    }
                    return { ...prev, value: nextVal, isFull: nextVal >= 100 };
                });
            }

            // Damage Opponent (Enemy ONLY takes damage on attacks)
            setOpponent((prev) => {
                const nextHp = Math.max(0, prev.currentHp - targetAbility.damage);
                if (nextHp === 0) {
                    setBannerMessage('KO');
                    soundFx.playAnnouncerStinger();
                }
                return {
                    ...prev,
                    currentHp: nextHp,
                    isHurt: true,
                };
            });

            // Combo & Floating Text
            setComboCount((prev) => prev + 1);
            addFloatingText(
                `-${targetAbility.damage} ${type === 'ult' ? '★ CRYSTAL BURST!' : type === 'heavy' ? 'CRITICAL!' : 'LIGHT HIT!'}`,
                type === 'ult' || type === 'heavy' ? 'critical' : 'damage',
                'right'
            );

            // Reset Hurt flash on opponent
            setTimeout(() => {
                setOpponent((prev) => ({ ...prev, isHurt: false }));
            }, 350);
        },
        [isMatchStarted, abilities, superMeter.value, actionPoints, addFloatingText]
    );

    // Handle Question Answer Selection
    const handleAnswerSelect = (selectedKey: 'A' | 'B' | 'C' | 'D' | null) => {
        if (!isMatchStarted || isAnswered) return;
        setIsAnswered(true);
        setSelectedAnswer(selectedKey);

        const isCorrect = selectedKey === activeQuestion.correctAnswer;

        if (isCorrect) {
            soundFx.playCorrect();
            const multiplier = questionTimer > 50 ? 2.0 : questionTimer > 20 ? 1.5 : 1.0;
            const superGain = Math.round(25 * multiplier);

            // Charge super meter
            setSuperMeter((prev) => {
                const nextVal = Math.min(100, prev.value + superGain);
                if (nextVal >= 100 && prev.value < 100) {
                    soundFx.playSuperReady();
                }
                return { ...prev, value: nextVal, isFull: nextVal >= 100 };
            });

            // Gain 1 Action Point for correct answer
            setActionPoints((prev) => prev + 1);

            // Note: Enemy does NOT take damage on correct answer anymore!
            // Damage is only dealt when the player attacks with Q, W, or E.
            addFloatingText('+1 ACTION POINT!', 'bonus', 'left');
            addFloatingText(`+${superGain} SUPER CHARGE!`, 'bonus', 'left');
            addFloatingText('CORRECT ANSWER!', 'streak', 'left');
            setComboCount((prev) => prev + 1);
        } else {
            soundFx.playWrong();
            // Player takes minor retaliation hit and loses 1 Action Point
            setPlayer((prev) => {
                const nextHp = Math.max(0, prev.currentHp - 10);
                return { ...prev, currentHp: nextHp, isHurt: true };
            });
            setActionPoints((prev) => Math.max(0, prev - 1));

            addFloatingText('-10 WRONG ANSWER!', 'damage', 'left');
            addFloatingText('-1 ACTION POINT!', 'damage', 'left');
            setComboCount(0);

            setTimeout(() => {
                setPlayer((prev) => ({ ...prev, isHurt: false }));
            }, 300);
        }

        // Advance to next question after reveal pause
        setTimeout(() => {
            setCurrentQuestionIdx((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setQuestionTimer(100);
        }, 1400);
    };

    // Keyboard Shortcuts (Q, W, E for attacks; A, B, C, D or 1, 2, 3, 4 for trivia)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input or if match hasn't started yet
            if (!isMatchStarted || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const key = e.key.toLowerCase();
            if (key === 'q') triggerAttack('light');
            if (key === 'w') triggerAttack('heavy');
            if (key === 'e') triggerAttack('ult');

            if (!isAnswered) {
                if (key === 'a' || key === '1') handleAnswerSelect('A');
                if (key === 'b' || key === '2') handleAnswerSelect('B');
                if (key === 'c' || key === '3') handleAnswerSelect('C');
                if (key === 'd' || key === '4') handleAnswerSelect('D');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMatchStarted, triggerAttack, isAnswered]);

    // Reset Match
    const resetMatch = () => {
        if (attackAnimTimerRef.current) {
            clearInterval(attackAnimTimerRef.current);
            attackAnimTimerRef.current = null;
        }
        setPlayerFrame(1);
        setIsPlayerAttacking(false);
        setPlayer((prev) => ({ ...prev, currentHp: 100, isHurt: false }));
        setOpponent((prev) => ({ ...prev, currentHp: 100, isHurt: false }));
        setTimeLeft(99);
        setIsTimeOver(false);
        setSuperMeter({ value: 35, max: 100, isFull: false });
        setActionPoints(0);
        setComboCount(0);
        setQuestionTimer(100);
        setIsAnswered(false);
        setSelectedAnswer(null);
        startMatchSequence();
    };

    const handleBannerComplete = useCallback(() => {
        setBannerMessage(null);
    }, []);

    const timerMultiplier = questionTimer > 50 ? 2.0 : questionTimer > 20 ? 1.5 : 1.0;

    return (
        <main
            className={`relative w-screen h-screen overflow-hidden select-none bg-neutral-950 flex flex-col justify-between ${
                screenShake ? 'animate-shake' : ''
            }`}
        >
            {/* Quick Nav: Return to Character Select */}
            <div className="absolute top-3 left-4 z-40">
                <Link
                    href="/char_selection"
                    className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider text-neutral-300 hover:text-white bg-black/60 hover:bg-black/90 border border-neutral-700 hover:border-sky-400 rounded transition-all flex items-center gap-1.5 backdrop-blur-xs shadow-md"
                    title="Return to Character Selection"
                >
                    <span>◀</span> FIGHTERS
                </Link>
            </div>
            {/* 1. BACKGROUND BATTLE STAGE */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/img/battle_arena.jpg"
                    alt="Byte Battle Arena"
                    fill
                    priority
                    className="object-cover object-center filter brightness-90 contrast-110"
                />

                {/* Animated Ambient Embers & Lighting Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

                {/* Left Fighter Sprite: Selected Player (Animated 8-frame attack cycle) */}
                <div
                    className={`absolute bottom-[18%] sm:bottom-[20%] md:bottom-[22%] left-[8%] sm:left-[12%] md:left-[16%] w-56 h-56 sm:w-72 sm:h-72 md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] transition-transform duration-100 ${
                        player.isHurt
                            ? 'translate-x-[-12px] brightness-150'
                            : isPlayerAttacking
                            ? 'scale-105 filter drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]'
                            : 'animate-idle'
                    }`}
                >
                    <Image
                        key={`${playerConfig.id}-${playerFrame}`}
                        src={getSpriteFrameUrl(playerConfig, playerFrame)}
                        alt={`${playerConfig.name} Fighter`}
                        fill
                        unoptimized
                        priority
                        className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                    />
                </div>

                {/* Right Fighter Sprite: Opponent (mirrored to face left) */}
                <div
                    className={`absolute bottom-[18%] sm:bottom-[20%] md:bottom-[22%] right-[8%] sm:right-[12%] md:right-[16%] w-56 h-56 sm:w-72 sm:h-72 md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] transition-transform duration-100 ${
                        opponent.isHurt
                            ? 'translate-x-[12px] brightness-150 contrast-125'
                            : 'animate-idle-delayed'
                    }`}
                >
                    <Image
                        key={`${opponentConfig.id}-idle`}
                        src={getSpriteFrameUrl(opponentConfig, 1)}
                        alt={`${opponentConfig.name} Fighter`}
                        fill
                        unoptimized
                        priority
                        className="object-contain scale-x-[-1] filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                    />
                </div>
            </div>

            {/* Screen Flash on Ultimate Strike */}
            {screenFlash && (
                <div className="absolute inset-0 bg-white/70 z-50 pointer-events-none transition-opacity duration-150" />
            )}

            {/* 2. TOPBAR (Match Status) */}
            <TopBar
                player={player}
                opponent={opponent}
                timeLeft={timeLeft}
                isTimeOver={isTimeOver}
            />

            {/* 3. COMBAT FEEDBACK (Midground / Ephemeral) */}
            <CombatFeedback
                bannerMessage={bannerMessage}
                onBannerComplete={handleBannerComplete}
                comboCount={comboCount}
                floatingTexts={floatingTexts}
            />

            {/* 4. CONTROL DECK (Bottom Interaction) */}
            <ControlDeck
                question={activeQuestion}
                timerProgress={questionTimer}
                timerMultiplier={timerMultiplier}
                selectedAnswer={selectedAnswer}
                isAnswered={isAnswered || !isMatchStarted}
                onSelectAnswer={handleAnswerSelect}
                abilities={abilities}
                superMeter={superMeter}
                actionPoints={actionPoints}
                onTriggerAction={triggerAttack}
            />

            {/* Optional Reset Match Floating Pill if match ends */}
            {(opponent.currentHp <= 0 || player.currentHp <= 0 || isTimeOver) && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center gap-3">
                    <button
                        onClick={resetMatch}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-mono font-black text-sm uppercase tracking-widest rounded border-2 border-white shadow-[0_0_20px_rgba(245,158,11,1)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        ↻ PLAY AGAIN / REMATCH
                    </button>
                    <Link
                        href="/char_selection"
                        className="px-6 py-2.5 bg-neutral-900/90 text-neutral-200 hover:text-white font-mono font-black text-sm uppercase tracking-widest rounded border-2 border-neutral-600 hover:border-cyan-400 shadow-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
                    >
                        ⇄ SELECT FIGHTER
                    </Link>
                </div>
            )}

            {/* Inline keyframe animations for idle sprite breathing & screen shake */}
            <style jsx global>{`
                @keyframes idleBreathing {
                    0%, 100% {
                        transform: translateY(0px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-4px) scaleY(1.015);
                    }
                }
                .animate-idle {
                    animation: idleBreathing 2.4s ease-in-out infinite;
                }
                .animate-idle-delayed {
                    animation: idleBreathing 2.4s ease-in-out infinite;
                    animation-delay: 1.2s;
                }
                @keyframes screenShake {
                    0% { transform: translate(0, 0); }
                    20% { transform: translate(-4px, 3px); }
                    40% { transform: translate(4px, -2px); }
                    60% { transform: translate(-3px, 2px); }
                    80% { transform: translate(2px, -1px); }
                    100% { transform: translate(0, 0); }
                }
                .animate-shake {
                    animation: screenShake 0.25s ease-in-out;
                }
            `}</style>
        </main>
    );
};
