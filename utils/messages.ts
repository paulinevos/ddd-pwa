export enum MessageType {
    PlayerJoined = 'PlayerJoined',
    SyncPlayers = 'SyncPlayers',
    RequestPlayerList = 'RequestPlayerList',
    InitiateGameState = 'InitiateGameState',
    GameStarted = 'GameStarted',
    GameEnded = 'GameEnded',
}

export class Message {
    type: MessageType;
    payload: any;

    constructor(type: MessageType, payload: any = {}) {
        this.type = type;
        this.payload = payload;
    }
}