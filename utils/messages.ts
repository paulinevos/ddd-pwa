enum MessageType {
    PlayerJoined = 'PlayerJoined',
    InitiateGameState = 'InitiateGameState',
    GameStarted = 'GameStarted',
    GameEnded = 'GameEnded',
}

class Message {
    constructor(type: MessageType, payload: object = {}) {
        this.type = type
        this.payload = payload
    }

    type: MessageType
    payload: object
}

export { MessageType, Message }