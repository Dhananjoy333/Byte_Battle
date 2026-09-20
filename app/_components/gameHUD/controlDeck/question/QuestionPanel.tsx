'use client';

import React from 'react';
import { QuestionPrompt } from './QuestionPrompt';
import { AnswerOptionsContainer } from './AnswerOptionsContainer';
import { AnswerTimerBar } from './AnswerTimerBar';
import { TriviaQuestion } from '../../types';

interface QuestionPanelProps {
    question: TriviaQuestion;
    timerProgress: number;
    timerMultiplier: number;
    selectedAnswer: string | null;
    isAnswered: boolean;
    onSelectAnswer: (key: 'A' | 'B' | 'C' | 'D') => void;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
    question,
    timerProgress,
    timerMultiplier,
    selectedAnswer,
    isAnswered,
    onSelectAnswer,
}) => {
    return (
        <section
            aria-label="Question Deck"
            className="relative flex flex-col justify-between p-3.5 sm:p-4 bg-neutral-950/85 backdrop-blur-md border-2 border-neutral-700/80 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-full max-w-xl min-h-[200px] gap-3"
        >
            {/* Top Cyan Trim & Pixel Corner Highlights */}
            <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Question Prompt */}
            <QuestionPrompt question={question} />

            {/* Answer Options */}
            <AnswerOptionsContainer
                options={question.options}
                selectedKey={selectedAnswer}
                correctKey={question.correctAnswer}
                isAnswered={isAnswered}
                onSelectOption={onSelectAnswer}
            />

            {/* Turn Timer Bar */}
            <AnswerTimerBar progress={timerProgress} multiplier={timerMultiplier} />
        </section>
    );
};
