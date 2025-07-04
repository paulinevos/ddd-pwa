import { fetch } from 'expo/fetch';

class TokenResponse {
	token: string | null;
	error: Error | null;

	constructor(token: string | null, error: Error | null = null) {
		this.token = token;
		this.error = error;
	}
}

// Helper function to determine the correct host
const getTokenServerHost = () => {
	const configuredHost = process.env.EXPO_PUBLIC_TOKEN_SERVER_HOST;
	// If hostname is 'tokens' (Docker service name), provide fallback for browser environment
	if (configuredHost === 'tokens' && typeof window !== 'undefined') {
		return 'localhost';
	}
	return configuredHost;
};

const fetchToken = async (
	path: string,
	code: string | null = null
): Promise<TokenResponse> => {
	const host = getTokenServerHost();
	const protocol = process.env.EXPO_PUBLIC_TOKEN_SERVER_PROTOCOL;
	const port = process.env.EXPO_PUBLIC_TOKEN_SERVER_PORT;

	const base = `${protocol}://${host}:${port}`;
	try {
		const url = `${base}/${path}${code ? `?code=${code}` : ''}`;
		const res = await fetch(url);
		const body = await res.json();

		const { token, error } = body;

		return new TokenResponse(token, error);
	} catch (e) {
		return new TokenResponse(null, e);
	}
};

const hostGame = async (): Promise<TokenResponse> => {
	return await fetchToken('host');
};

const joinGame = async (code: string): Promise<TokenResponse> => {
	return await fetchToken('join', code);
};

export { hostGame, joinGame, TokenResponse };
