import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState } from '@/lib/types';

const KeyGameState = 'ddd_gameState';

export const commitState = (state: GameState) =>
	localStorage.setItem(KeyGameState, JSON.stringify(state));

export const fetchStateFromStorage = (): GameState | null => {
	if (typeof window !== 'undefined') {
		const json = localStorage.getItem(KeyGameState);
        if (!json) return null;
		try {
		    return JSON.parse(json) as GameState;
        } catch (e) {
            console.error("Failed to parse game state from storage", e);
            localStorage.removeItem(KeyGameState); // Clear corrupted state
            return null;
        }
	}
    return null;
};

export const destroyState = () => {
	localStorage.removeItem(KeyGameState);
};

interface GameContextType {
	gameState: GameState | null;
	setGameState: (state: GameState | null) => void;
}

export const GameContext = createContext<GameContextType>({ 
    gameState: null,
    setGameState: () => {},
});

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState<GameState | null>(() => fetchStateFromStorage());

    const handleSetGameState = (state: GameState | null) => {
        setGameState(state);
        if (state) {
            commitState(state);
        } else {
            destroyState();
        }
    };

    return (
        <GameContext.Provider value={{ gameState, setGameState: handleSetGameState }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
