import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getDefaultOpponent } from '@/app/_data/characters';

export type GameMode = 'pve' | 'pvp';

export interface PlayerInfo {
    id: string;
    characterId: string;
}

export interface GameState {
    gameMode: GameMode;
    selectedCharacterId: string;
    opponentCharacterId: string;
    roomID: string;
    roomOwnerId: string | null;
    player1: PlayerInfo | null;
    player2: PlayerInfo | null;

    setGameMode: (mode: GameMode) => void;
    setSelectedCharacter: (id: string) => void;
    setOpponentCharacter: (id: string) => void;
    swapOpponentIfSame: () => void;
    setRoomIDStore: (id: string) => void;
    setRoomOwnerId: (id: string | null) => void;
    setPlayer1: (player: PlayerInfo | null) => void;
    setPlayer2: (player: PlayerInfo | null) => void;
    setPlayersFromMatch: (params: {
        characters: Record<string, string>;
        ownerId: string;
        players?: string[];
        myPlayerId?: string | null;
    }) => void;
    resetPvP: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            gameMode: 'pve',
            selectedCharacterId: 'aurelia',
            opponentCharacterId: 'kira',
            roomID: '',
            roomOwnerId: null,
            player1: null,
            player2: null,

            setGameMode: (mode: GameMode) => {
                set({ gameMode: mode });
            },

            setRoomIDStore: (id: string) => {
                set({
                    roomID: id,
                });
            },

            setRoomOwnerId: (id: string | null) => {
                set({
                    roomOwnerId: id,
                });
            },

            setPlayer1: (player: PlayerInfo | null) => {
                set({ player1: player });
            },

            setPlayer2: (player: PlayerInfo | null) => {
                set({ player2: player });
            },

            setPlayersFromMatch: ({ characters, ownerId, players, myPlayerId }) => {
                const p1Id = ownerId;
                const p1CharId = characters[p1Id] || get().selectedCharacterId || 'aurelia';

                // Find player 2 (non-owner)
                const otherKey = Object.keys(characters).find((k) => k !== ownerId);
                const p2Id = (players && players.find((p) => p !== ownerId)) || otherKey || 'player2';
                const p2CharId = characters[p2Id] || get().opponentCharacterId || 'kira';

                const p1: PlayerInfo = {
                    id: p1Id,
                    characterId: p1CharId,
                };
                const p2: PlayerInfo = {
                    id: p2Id,
                    characterId: p2CharId,
                };

                // Determine user's local character and opponent character
                const isLocalPlayer1 = myPlayerId ? myPlayerId === p1Id : true;
                const selectedChar = isLocalPlayer1 ? p1CharId : p2CharId;
                const opponentChar = isLocalPlayer1 ? p2CharId : p1CharId;

                set({
                    gameMode: 'pvp',
                    roomOwnerId: ownerId,
                    player1: p1,
                    player2: p2,
                    selectedCharacterId: selectedChar,
                    opponentCharacterId: opponentChar,
                });
            },

            resetPvP: () => {
                set({
                    gameMode: 'pve',
                    roomID: '',
                    roomOwnerId: null,
                    player1: null,
                    player2: null,
                });
            },

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
