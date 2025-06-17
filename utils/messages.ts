enum MessageType {
    PlayerJoined,
    InitiateGameState,
    GameStarted,
    GameEnded,
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