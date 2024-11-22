import {fetch} from "expo/fetch";

class TokenResponse {
    token: string|null
    error: Error|null

    constructor(token: string | null, error: Error | null = null) {
        this.token = token;
        this.error = error;
    }
}
const fetchToken = async (path: string, code: string | null = null): Promise<TokenResponse> => {
    const base = `${process.env.EXPO_PUBLIC_TOKEN_SERVER_PROTOCOL}://${process.env.EXPO_PUBLIC_TOKEN_SERVER_HOST}:${process.env.EXPO_PUBLIC_TOKEN_SERVER_PORT}`
    try {
        const url = `${ base }/${ path }${ code ? `?code=${code}` : ''}`
        const res = await fetch(url)
        const { token } = await res.json()

        return new TokenResponse(token)
    } catch (e) {
        return new TokenResponse(null, e)
    }
}

const hostGame = async (): Promise<TokenResponse> => {
    return await fetchToken('host')
}

const joinGame = async (code: string): Promise<TokenResponse> => {
    return await fetchToken('join', code)
}

export {hostGame, joinGame, TokenResponse}
