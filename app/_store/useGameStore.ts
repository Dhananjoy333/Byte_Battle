import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getDefaultOpponent } from '@/app/_data/characters';

export interface GameState {
    selectedCharacterId: string;
    opponentCharacterId: string;
    setSelectedCharacter: (id: string) => void;
    setOpponentCharacter: (id: string) => void;
    swapOpponentIfSame: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            selectedCharacterId: 'aurelia',
            opponentCharacterId: 'kira',

            setSelectedCharacter: (id: string) => {
                const currentOpponent = get().opponentCharacterId;
                // If player selects current opponent character, auto-assign a distinct opponent
                const nextOpponent =
                    currentOpponent === id ? getDefaultOpponent(id).id : currentOpponent;

                set({
                    selectedCharacterId: id,
                    opponentCharacterId: nextOpponent,
                });
            },

            setOpponentCharacter: (id: string) => {
                set({ opponentCharacterId: id });
            },

            swapOpponentIfSame: () => {
                const { selectedCharacterId, opponentCharacterId } = get();
                if (selectedCharacterId === opponentCharacterId) {
                    set({ opponentCharacterId: getDefaultOpponent(selectedCharacterId).id });
                }
            },
        }),
        {
            name: 'byte-battle-game-storage',
            storage: createJSONStorage(() =>
                typeof window !== 'undefined'
                    ? localStorage
                    : {
                          getItem: () => null,
                          setItem: () => {},
                          removeItem: () => {},
                      }
            ),
        }
    )
);
