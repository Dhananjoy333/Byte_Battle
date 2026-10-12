'use client';

import { useState, useCallback, useMemo } from 'react';
import { TERRITORY_QUESTIONS, TerritoryQuestion } from './data/questions';

export type SessionStatus = 'answering' | 'decision' | 'lost' | 'idle';

export const BASE_BIT_REWARD = 2;

/**
 * Calculates the bit reward for a question based on consecutive correct answers in current streak.
 * Formula: reward = 2 + floor(correctAnswersInCurrentStreak / 2)
 *
 * Sequence:
 * Questions 1–2 (streak 0, 1) -> +2 bits
 * Questions 3–4 (streak 2, 3) -> +3 bits
 * Questions 5–6 (streak 4, 5) -> +4 bits
 * Questions 7–8 (streak 6, 7) -> +5 bits
 * Questions 9–10 (streak 8, 9) -> +6 bits
 * ...indefinitely
 */
export function calculateBitReward(correctStreak: number): number {
  return BASE_BIT_REWARD + Math.floor(correctStreak / 2);
}

/**
 * Calculates the NEXT reward tier for the "RISK IT AND EARN +{nextReward} BITS" button.
 * Current reward = +2 -> next reward = +3
 * Current reward = +3 -> next reward = +4
 * Current reward = +4 -> next reward = +5
 */
export function calculateNextReward(currentReward: number): number {
  return currentReward + 1;
}

export interface UseQuestionSessionReturn {
  currentQuestion: TerritoryQuestion;
  currentQuestionIndex: number;
  unbankedBits: number;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D' | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  sessionStatus: SessionStatus;
  lostBitsAmount: number;
  correctStreak: number;
  currentReward: number;
  nextReward: number;
  answerQuestion: (key: 'A' | 'B' | 'C' | 'D', onSessionLost?: () => void) => void;
  continueToNextQuestion: () => void;
  bankBits: (onBankSuccess: (bits: number) => void) => void;
  resetSession: () => void;
}

export function useQuestionSession(): UseQuestionSessionReturn {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [unbankedBits, setUnbankedBits] = useState<number>(0);
  const [lostBitsAmount, setLostBitsAmount] = useState<number>(0);
  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('answering');

  // Single source of truth for current question reward and next tier reward
  const currentReward = calculateBitReward(correctStreak);
  const nextReward = calculateNextReward(currentReward);

  const rawQuestion = TERRITORY_QUESTIONS[questionIndex % TERRITORY_QUESTIONS.length];
  const currentQuestion: TerritoryQuestion = useMemo(
    () => ({
      ...rawQuestion,
      reward: currentReward,
    }),
    [rawQuestion, currentReward]
  );

  const answerQuestion = useCallback(
    (key: 'A' | 'B' | 'C' | 'D', onSessionLost?: () => void) => {
      if (isAnswered) return;

      setSelectedOptionKey(key);
      setIsAnswered(true);

      const correct = key === currentQuestion.correctAnswer;
      setIsCorrect(correct);

      if (correct) {
        // Player answered correctly: add calculated reward to unbankedBits and enter decision phase
        setUnbankedBits((prev) => prev + currentReward);
        setSessionStatus('decision');
      } else {
        // Player answered incorrectly: unbankedBits = 0 and earnings lost; reset streak
        setLostBitsAmount(unbankedBits);
        setUnbankedBits(0);
        setCorrectStreak(0);
        setSessionStatus('lost');

        // Automatically end session after brief feedback duration
        if (onSessionLost) {
          setTimeout(() => {
            onSessionLost();
          }, 1800);
        }
      }
    },
    [isAnswered, currentQuestion.correctAnswer, currentReward, unbankedBits]
  );

  const continueToNextQuestion = useCallback(() => {
    // Advance to next question while keeping unbankedBits at risk and progressing streak
    setCorrectStreak((prev) => prev + 1);
    setQuestionIndex((prev) => (prev + 1) % TERRITORY_QUESTIONS.length);
    setSelectedOptionKey(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setSessionStatus('answering');
  }, []);

  const bankBits = useCallback(
    (onBankSuccess: (bits: number) => void) => {
      const secured = unbankedBits;
      setUnbankedBits(0);
      setCorrectStreak(0);
      setSelectedOptionKey(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setSessionStatus('answering');
      onBankSuccess(secured);
    },
    [unbankedBits]
  );

  const resetSession = useCallback(() => {
    setCorrectStreak(0);
    setUnbankedBits(0);
    setLostBitsAmount(0);
    setSelectedOptionKey(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setSessionStatus('answering');
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex: questionIndex,
    unbankedBits,
    selectedOptionKey,
    isAnswered,
    isCorrect,
    sessionStatus,
    lostBitsAmount,
    correctStreak,
    currentReward,
    nextReward,
    answerQuestion,
    continueToNextQuestion,
    bankBits,
    resetSession,
  };
}
