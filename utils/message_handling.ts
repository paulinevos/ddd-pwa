import {EventSource} from 'eventsource'
import {Message, MessageType} from "@/utils/messages";
import {initGameState} from "@/utils/game_data";

const KeyLastEventId = 'ddd_lastEventId'
const hubUrl = `${process.env.EXPO_PUBLIC_MERCURE_HUB}/.well-known/mercure`
const connect = (token: string): EventSource => {
    const payload = parseToken(token)

    if (payload.isHost()) {
        initGameState(payload.userId, payload.code)
    }

    const url = new URL(hubUrl)
    const base = 'https://localhost/.well-known/mercure/'
    const topic = `${base}${payload.code}`

    url.searchParams.append('topic', topic)
    url.searchParams.append('topic', `${topic}/${payload.userId}`)

    if (sessionStorage.getItem(KeyLastEventId)) {
        url.searchParams.append('lastEventID', <string>localStorage.getItem(KeyLastEventId))
    }

    return new EventSource(url, {withCredentials: true})
}

const activeSubscriptions = (token: string): EventSource => {
    const url = new URL(`${hubUrl}`)
    url.searchParams.append('topic', '/.well-known/mercure/subscriptions{/topic}{/subscriber}')

    console.debug('Listening to active subscriptions')
    return new EventSource(url);
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

    const data = new URLSearchParams();
    data.append('topic', outgoing.topic);
    data.append('data', JSON.stringify(outgoing.payload));

    await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/x-www-form-urlencoded"
        },
        method: 'POST',
        body: data,
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

export { connect, send, createOutGoing, activeSubscriptions, parseToken }