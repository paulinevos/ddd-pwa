import { EventSource } from 'eventsource';
import { Message, MessageType } from '@/utils/messages';


const KeyLastEventId = 'ddd_lastEventId';
const hubUrl = `${process.env.EXPO_PUBLIC_MERCURE_HUB}/.well-known/mercure`;
const topicBaseUrl = process.env.EXPO_PUBLIC_MERCURE_TOPIC_URL;

class TokenPayload {
    userId: string;
    role: string;
    code: string;

    constructor(userId: string, role: string, code: string) {
        this.userId = userId;
        this.role = role;
        this.code = code;
    }

    isHost(): boolean {
        return this.role === 'Host';
    }
}

export const parseToken = (token: string): TokenPayload => {
    console.log('[MercureService] Parsing token...');
    const encoded = token.split('.')[1] || '';
    if (!encoded) {
        console.error('[MercureService] JWT format is invalid');
        throw new Error('JWT format is invalid');
    }

    try {
        const decoded = JSON.parse(atob(encoded));
        const { mercure } = decoded;
        const { payload } = mercure;
        const { user_id, role, code } = payload;
        console.log('[MercureService] Token parsed successfully:', {
            userId: user_id,
            role,
            code,
            isHost: role === 'Host'
        });
        return new TokenPayload(user_id, role, code);
    } catch (error) {
        console.error('[MercureService] Error parsing token:', error);
        throw error;
    }
};

export const connect = (token: string): EventSource => {
    const payload = parseToken(token);



    const url = new URL(hubUrl);
    const topic = `${topicBaseUrl}${payload.code}`;

    url.searchParams.append('topic', topic);
    url.searchParams.append('topic', `${topic}/${payload.userId}`);

    if (sessionStorage.getItem(KeyLastEventId)) {
        url.searchParams.append('lastEventID', localStorage.getItem(KeyLastEventId) as string);
    }

    return new EventSource(url, { withCredentials: true });
};

export const activeSubscriptions = (token: string): EventSource => {
    const url = new URL(hubUrl);
    // The topic for subscriptions is a special, reserved topic.
    // We construct it relative to the base hub URL.
    const subscriptionsTopic = new URL('/.well-known/mercure/subscriptions', hubUrl).toString();
    url.searchParams.append('topic', subscriptionsTopic);

    console.debug('Listening to active subscriptions on:', url.toString());
    return new EventSource(url.toString(), { withCredentials: true });
};

class OutgoingMessage {
    topic: string;
    payload: Message;
    constructor(topic: string, payload: Message) {
        this.topic = topic;
        this.payload = payload;
    }
}

const topicForMessageType = (base: string, type: MessageType): string => {
    switch (type) {
                case MessageType.PlayerJoined:
            return base;
        default:
            console.warn(`Unhandled message type for topic: ${type}`);
            return base; // Default to base topic for unknown types
    }
};

const createOutGoing = (token: string, message: Message): OutgoingMessage => {
    const payload = parseToken(token);

    return new OutgoingMessage(
        topicForMessageType(`${topicBaseUrl}${payload.code}`, message.type),
        message
    );
};

export const send = async (token: string, message: Message) => {
    console.log('[MercureService] Sending message:', message);
    const outgoing = createOutGoing(token, message);
    const url = new URL(hubUrl);
    console.log('[MercureService] Posting to URL:', url.toString());

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
        });
        
        console.log('[MercureService] Message sent, response status:', response.status);
        if (!response.ok) {
            console.error('[MercureService] Error sending message:', await response.text());
        }
    } catch (error) {
        console.error('[MercureService] Failed to send message:', error);
    }
};
