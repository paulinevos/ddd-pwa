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
    console.log('[MessageHandling] Sending message:', message);
    const outgoing = createOutGoing(token, message)
    const url = new URL(hubUrl)
    console.log('[MessageHandling] Posting to URL:', url.toString());

    const data = new URLSearchParams();
    data.append('topic', outgoing.topic);
    data.append('data', JSON.stringify(outgoing.payload));
    
    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/x-www-form-urlencoded"
            },
            method: 'POST',
            body: data,
        })
        
        console.log('[MessageHandling] Message sent, response status:', response.status);
        if (!response.ok) {
            console.error('[MessageHandling] Error sending message:', await response.text());
        }
    } catch (error) {
        console.error('[MessageHandling] Failed to send message:', error);
    }
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
    console.log('[MessageHandling] Parsing token...');
    const encoded = token.split('.')[1] || ''
    if (!encoded) {
        console.error('[MessageHandling] JWT format is invalid');
        throw new Error('JWT format is invalid')
    }

    try {
        const decoded = JSON.parse(atob(encoded));
        const { mercure } = decoded;
        const { payload } = mercure;
        const {user_id, role, code} = payload;
        console.log('[MessageHandling] Token parsed successfully:', {
            userId: user_id,
            role,
            code,
            isHost: role === 'Host'
        });
        return new TokenPayload(user_id, role, code);
    } catch (error) {
        console.error('[MessageHandling] Error parsing token:', error);
        throw error;
    }
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