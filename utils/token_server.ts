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
		console.log(
			'Browser detected: using localhost instead of Docker service name'
		);
		return 'localhost';
	}
	console.log(`Using configured host: ${configuredHost}`);
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
		console.log(`DEBUG: Fetching token from URL: ${url}`);
		console.log(
			`DEBUG: Environment values - PROTOCOL=${protocol}, HOST=${host}, PORT=${port}`
		);
		console.log(
			`DEBUG: Running environment: ${
				typeof window !== 'undefined' ? 'Browser' : 'Node/Native'
			}`
		);

		const res = await fetch(url);
		console.log(`DEBUG: Fetch response status: ${res.status}`);
		const body = await res.json();
		console.log(`DEBUG: Response body:`, body);

		const { token, error } = body;
		console.log(
			`DEBUG: Token received: ${token ? 'YES' : 'NO'}, Error: ${
				error ? JSON.stringify(error) : 'None'
			}`
		);

		return new TokenResponse(token, error);
	} catch (e) {
		console.error(`DEBUG ERROR: Fetch failed:`, e);
		console.error(
			`DEBUG ERROR: Error message: ${
				e instanceof Error ? e.message : 'Unknown error'
			}`
		);
		console.error(
			`DEBUG ERROR: Error stack: ${e instanceof Error ? e.stack : 'No stack'}`
		);
		return new TokenResponse(null, e);
	}
};

const hostGame = async (): Promise<TokenResponse> => {
	console.log('DEBUG: Calling hostGame()');
	return await fetchToken('host');
};

const joinGame = async (code: string): Promise<TokenResponse> => {
	console.log(`DEBUG: Calling joinGame() with code: ${code}`);
	return await fetchToken('join', code);
};

export { hostGame, joinGame, TokenResponse };
