'use client';

import React from 'react';
import { QuestionPanel } from './question/QuestionPanel';
import { ActionControls } from './actions/ActionControls';
import { TriviaQuestion, ActionAbility, SuperMeterState, ActionType } from '../types';

interface ControlDeckProps {
    question: TriviaQuestion;
    timerProgress: number;
    timerMultiplier: number;
    selectedAnswer: string | null;
    isAnswered: boolean;
    onSelectAnswer: (key: 'A' | 'B' | 'C' | 'D') => void;
    abilities: ActionAbility[];
    superMeter: SuperMeterState;
    actionPoints: number;
    onTriggerAction: (type: ActionType) => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
    question,
    timerProgress,
    timerMultiplier,
    selectedAnswer,
    isAnswered,
    onSelectAnswer,
    abilities,
    superMeter,
    actionPoints,
    onTriggerAction,
}) => {
    return (
        <footer className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 pb-3 sm:pb-5 z-30 flex flex-col md:flex-row items-end justify-between gap-3 sm:gap-6 pointer-events-auto">
            {/* Left Side: Question Panel */}
            <div className="w-full md:flex-1 max-w-xl">
                <QuestionPanel
                    question={question}
                    timerProgress={timerProgress}
                    timerMultiplier={timerMultiplier}
                    selectedAnswer={selectedAnswer}
                    isAnswered={isAnswered}
                    onSelectAnswer={onSelectAnswer}
                />
            </div>

            {/* Right Side: Action Controls */}
            <div className="w-full md:w-auto flex justify-end">
                <ActionControls
                    abilities={abilities}
                    superMeter={superMeter}
                    actionPoints={actionPoints}
                    onTriggerAction={onTriggerAction}
                />
            </div>
        </footer>
    );
};
