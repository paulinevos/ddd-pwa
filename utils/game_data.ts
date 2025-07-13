import { GameState, Status } from '@/lib/types';

export const initGameState = (hostId: string, code: string): GameState => {
	return {
		hostId,
		code,
		players: [],
		status: Status.Waiting,
		lastEventId: null,
	};
};
