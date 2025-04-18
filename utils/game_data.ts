import {createContext, useContext} from "react";

const KeyGameState = 'ddd_gameState'
class Player {
    id: string
    displayName: string
    avatar: string

    constructor({id, displayName, avatar}) {
        this.id = id;
        this.displayName = displayName;
        this.avatar = avatar;
    }
}

enum Status {
    Waiting,
    Started,
    Ended,
}

type GameState = {
    hostId: string;
    code: string;
    players: Player[];
    lastEventId: string|null,
    status: Status,
}

const commitState = (state: GameState) => localStorage.setItem(KeyGameState, JSON.stringify(state))

const initGameState = (hostId: string, code: string): GameState => {
    return {
        hostId,
        code,
        players: [],
        status: Status.Waiting,
    } as GameState
}

const fetchStateFromStorage = (): GameState => {
    if (typeof window !== 'undefined') {
        const json = <string>localStorage.getItem(KeyGameState)
        return JSON.parse(json) as GameState
    }
}

const destroyState = (state: GameState) => {
    localStorage.removeItem(KeyGameState)
}

const GameContext = createContext({
    gameState: fetchStateFromStorage(),
    setGameState: (state: GameState) => {}
})

const useGameContext = () => useContext(GameContext);

export { GameState, GameContext, useGameContext, Player, commitState, initGameState, fetchStateFromStorage, destroyState }