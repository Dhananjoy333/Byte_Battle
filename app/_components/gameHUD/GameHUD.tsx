'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { TopBar } from './topBar/TopBar';
import { CombatFeedback } from './combatFeedback/CombatFeedback';
import { ControlDeck } from './controlDeck/ControlDeck';
import { soundFx } from './audioSynth';
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
    // Fighters State
    const [player, setPlayer] = useState<FighterState>({
        id: 'kai',
        name: 'KAI',
        title: 'THE DRAGON FIST',
        portraitUrl: '/char_portrait/kai.jpg',
        currentHp: 100,
        maxHp: 100,
        roundsWon: 1,
        maxRounds: 2,
        isHurt: false,
    });

    const [opponent, setOpponent] = useState<FighterState>({
        id: 'ryuuga',
        name: 'RYUUGA',
        title: 'SHADOW BLADE',
        portraitUrl: '/char_portrait/ryuuga.jpg',
        currentHp: 100,
        maxHp: 100,
        roundsWon: 0,
        maxRounds: 2,
        isHurt: false,
    });

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

    // Action Abilities
    const [abilities, setAbilities] = useState<ActionAbility[]>([
        {
            type: 'light',
            label: 'LIGHT',
            hotkey: 'Q',
            damage: 12,
            cooldownTotal: 2.0,
            currentCooldown: 0,
            superCost: 0,
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
            isReady: false,
            themeColor: 'red',
        },
    ]);

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

    // Initial Match Announcement Sequence
    useEffect(() => {
        soundFx.playAnnouncerStinger();
        const fightTimer = setTimeout(() => {
            setBannerMessage('FIGHT');
            soundFx.playAnnouncerStinger();
        }, 1200);

        return () => clearTimeout(fightTimer);
    }, []);

    // Match Timer Countdown (every 1 second)
    useEffect(() => {
        if (timeLeft <= 0 || isTimeOver) return;

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
    }, [timeLeft, isTimeOver]);

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

    // Question Turn Timer tick
    useEffect(() => {
        if (isAnswered) return;

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
    }, [isAnswered]);

    // Execute Attacks
    const triggerAttack = useCallback(
        (type: ActionType) => {
            const targetAbility = abilities.find((a) => a.type === type);
            if (!targetAbility || targetAbility.currentCooldown > 0) return;
            if (type === 'ult' && superMeter.value < 100) return;

            soundFx.playHit(type);

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

            // Damage Opponent
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
                `-${targetAbility.damage} ${type === 'ult' ? '★ DRAGON STRIKE!' : type === 'heavy' ? 'CRITICAL!' : ''}`,
                type === 'ult' || type === 'heavy' ? 'critical' : 'damage',
                'right'
            );

            // Reset Hurt flash on opponent
            setTimeout(() => {
                setOpponent((prev) => ({ ...prev, isHurt: false }));
            }, 300);
        },
        [abilities, superMeter.value, addFloatingText]
    );

    // Handle Question Answer Selection
    const handleAnswerSelect = (selectedKey: 'A' | 'B' | 'C' | 'D' | null) => {
        if (isAnswered) return;
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

            // Damage opponent as trivia counter-hit
            setOpponent((prev) => {
                const nextHp = Math.max(0, prev.currentHp - 15);
                return { ...prev, currentHp: nextHp, isHurt: true };
            });

            addFloatingText(`+${superGain} SUPER CHARGE!`, 'bonus', 'left');
            addFloatingText('-15 COUNTER HIT!', 'hit', 'right');
            setComboCount((prev) => prev + 1);

            setTimeout(() => {
                setOpponent((prev) => ({ ...prev, isHurt: false }));
            }, 300);
        } else {
            soundFx.playWrong();
            // Player takes minor retaliation hit
            setPlayer((prev) => {
                const nextHp = Math.max(0, prev.currentHp - 10);
                return { ...prev, currentHp: nextHp, isHurt: true };
            });

            addFloatingText('-10 WRONG ANSWER!', 'damage', 'left');
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
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
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
    }, [triggerAttack, isAnswered]);

    // Reset Match
    const resetMatch = () => {
        setPlayer((prev) => ({ ...prev, currentHp: 100, isHurt: false }));
        setOpponent((prev) => ({ ...prev, currentHp: 100, isHurt: false }));
        setTimeLeft(99);
        setIsTimeOver(false);
        setSuperMeter({ value: 35, max: 100, isFull: false });
        setComboCount(0);
        setBannerMessage('ROUND_1');
        setTimeout(() => setBannerMessage('FIGHT'), 1200);
    };

    const timerMultiplier = questionTimer > 50 ? 2.0 : questionTimer > 20 ? 1.5 : 1.0;

    return (
        <main
            className={`relative w-screen h-screen overflow-hidden select-none bg-neutral-950 flex flex-col justify-between ${
                screenShake ? 'animate-shake' : ''
            }`}
        >
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

                {/* Left Fighter Sprite: Kai (martial arts stance) */}
                <div
                    className={`absolute bottom-[22%] sm:bottom-[24%] left-[12%] sm:left-[16%] md:left-[22%] w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 transition-transform duration-100 ${
                        player.isHurt ? 'translate-x-[-12px] brightness-150' : 'animate-idle'
                    }`}
                >
                    <Image
                        src="/img/kai_sprite.jpg"
                        alt="Kai Fighter"
                        fill
                        priority
                        className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                    />
                </div>

                {/* Right Fighter Sprite: Ryuuga (ninja sword stance) */}
                <div
                    className={`absolute bottom-[22%] sm:bottom-[24%] right-[12%] sm:right-[16%] md:right-[22%] w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 transition-transform duration-100 ${
                        opponent.isHurt ? 'translate-x-[12px] brightness-150' : 'animate-idle-delayed'
                    }`}
                >
                    <Image
                        src="/img/ryuuga_sprite.jpg"
                        alt="Ryuuga Fighter"
                        fill
                        priority
                        className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
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
                onBannerComplete={() => setBannerMessage(null)}
                comboCount={comboCount}
                floatingTexts={floatingTexts}
            />

            {/* 4. CONTROL DECK (Bottom Interaction) */}
            <ControlDeck
                question={activeQuestion}
                timerProgress={questionTimer}
                timerMultiplier={timerMultiplier}
                selectedAnswer={selectedAnswer}
                isAnswered={isAnswered}
                onSelectAnswer={handleAnswerSelect}
                abilities={abilities}
                superMeter={superMeter}
                onTriggerAction={triggerAttack}
            />

            {/* Optional Reset Match Floating Pill if match ends */}
            {(opponent.currentHp <= 0 || player.currentHp <= 0 || isTimeOver) && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                    <button
                        onClick={resetMatch}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-mono font-black text-sm uppercase tracking-widest rounded border-2 border-white shadow-[0_0_20px_rgba(245,158,11,1)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        ↻ PLAY AGAIN / REMATCH
                    </button>
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
