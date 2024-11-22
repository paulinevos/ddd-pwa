import {EventSource} from 'eventsource'
import {Message, MessageType} from "@/utils/messages";
import { GameState } from "@/utils/game_data";

const KeyLastEventId = 'ddd_lastEventId'
const hubUrl = `${process.env.EXPO_PUBLIC_MERCURE_HUB}/.well-known/mercure`
const connect = (token: string): EventSource => {
    const payload = parseToken(token)

    if (payload.isHost()) {
        GameState.init(payload.userId, payload.code)
    }

    const url = new URL(hubUrl)
    const topic = `https://localhost/.well-known/mercure/${payload.code}`

    url.searchParams.append('topic', topic)
    url.searchParams.append('topic', `${topic}/${payload.userId}`)

    if (sessionStorage.getItem(KeyLastEventId)) {
        url.searchParams.append('lastEventID', <string>localStorage.getItem(KeyLastEventId))
    }

    const events: EventSource = new EventSource(url);

    console.debug('Connected to event source...', url)

    return events
}

const onMessageHandled = (e: MessageEvent) => {
    sessionStorage.setItem(KeyLastEventId, e.lastEventId)
    // Apply to game state
}

class OutgoingMessage {
    topic: string
    payload: Message
    constructor(topic: string, payload: Message) {
        this.topic = topic;
        this.payload = payload;
    }
}
const send = async (token: string, message: Message) => {
    const outgoing = createOutGoing(token, message)
    const url = new URL(hubUrl)

    console.debug("Outgoing message: ", outgoing)

    const params = new URLSearchParams()
    params.append('topic', outgoing.topic)
    params.append('data', JSON.stringify(outgoing.payload))

    const headers = new Headers()
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
    // headers.append('Authorization', `Bearer ${token}`)
    await fetch(url.toString(), {
        headers,
        credentials: 'include',
        mode: 'no-cors',
        method: 'post',
        body: params
    })
}

class TokenPayload {
    userId: string
    role: string
    code: string

    constructor(userId: string, role: string, code: string) {
        this.userId = userId;
        this.role = role;
        this.code = code;
    }

    isHost(): boolean {
        return this.role == 'Host'
    }
}
const parseToken = (token: string): TokenPayload => {
    const encoded = token.split('.')[1] || ''
    if (!encoded) {
        throw new Error('JWT format is invalid')
    }

    const { mercure } = JSON.parse(atob(encoded))
    const { payload } = mercure
    const {user_id, role, code} = payload
    return new TokenPayload(user_id, role, code)
}


const createOutGoing = (token: string, message: Message): OutgoingMessage => {
    const payload = parseToken(token)

    return new OutgoingMessage(
        topicForMessageType(`https://localhost/.well-known/mercure/${payload.code}`, message.type),
        message
    )
}

const topicForMessageType = (base: string, type: MessageType): string => {
    switch (type) {
        case MessageType.PlayerJoined:
            return base
    }
}

export { connect, send, createOutGoing, onMessageHandled }