import {Context, createContext} from "react";

const KeyGameState = 'ddd_gameState'
class Player {
    id: string
    displayName: string
    avatar: string

    constructor(id: string, displayName: string, avatar: string) {
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
class GameState {
    hostId: string
    code: string
    players: any[]
    lastEventId: string | null
    state: Status

    constructor(
        hostId: string,
        code: string,
        state: Status = Status.Waiting,
        players: Player[] = [],
        lastEventId: string | null = null,
    ) {
        this.hostId = hostId
        this.code = code
        this.players = players
        this.lastEventId = lastEventId
        this.state = state
    }

    static init(hostId: string, code: string): GameState {
        const init = new GameState(hostId, code)
        localStorage.setItem(KeyGameState, JSON.stringify(init))
        return init
    }

    static destroy() {
        localStorage.removeItem(KeyGameState)
    }
}

const GameContext = createContext({
    state: null,
    setState: () => {}
})

export { GameState, GameContext, Player }