'use client';

import { useState, useCallback } from 'react';
import { TERRITORY_QUESTIONS, TerritoryQuestion } from './data/questions';

export type SessionStatus = 'answering' | 'decision' | 'lost' | 'idle';

export interface UseQuestionSessionReturn {
  currentQuestion: TerritoryQuestion;
  currentQuestionIndex: number;
  unbankedBits: number;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D' | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  sessionStatus: SessionStatus;
  lostBitsAmount: number;
  answerQuestion: (key: 'A' | 'B' | 'C' | 'D', onSessionLost?: () => void) => void;
  continueToNextQuestion: () => void;
  bankBits: (onBankSuccess: (bits: number) => void) => void;
  resetSession: () => void;
}

export function useQuestionSession(): UseQuestionSessionReturn {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [unbankedBits, setUnbankedBits] = useState<number>(0);
  const [lostBitsAmount, setLostBitsAmount] = useState<number>(0);
  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('answering');

  const currentQuestion = TERRITORY_QUESTIONS[questionIndex % TERRITORY_QUESTIONS.length];

  const answerQuestion = useCallback(
    (key: 'A' | 'B' | 'C' | 'D', onSessionLost?: () => void) => {
      if (isAnswered) return;

      setSelectedOptionKey(key);
      setIsAnswered(true);

      const correct = key === currentQuestion.correctAnswer;
      setIsCorrect(correct);

      if (correct) {
        // Player answered correctly: add reward to unbankedBits and enter decision phase
        setUnbankedBits((prev) => prev + currentQuestion.reward);
        setSessionStatus('decision');
      } else {
        // Player answered incorrectly: unbankedBits = 0 and earnings lost
        setLostBitsAmount(unbankedBits);
        setUnbankedBits(0);
        setSessionStatus('lost');

        // Automatically end session after brief feedback duration
        if (onSessionLost) {
          setTimeout(() => {
            onSessionLost();
          }, 1800);
        }
      }
    },
    [isAnswered, currentQuestion, unbankedBits]
  );

  const continueToNextQuestion = useCallback(() => {
    // Advance to next question while keeping unbankedBits at risk
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
      setSelectedOptionKey(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setSessionStatus('answering');
      onBankSuccess(secured);
    },
    [unbankedBits]
  );

  const resetSession = useCallback(() => {
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
    answerQuestion,
    continueToNextQuestion,
    bankBits,
    resetSession,
  };
}
