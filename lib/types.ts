export class Player {
	id: string;
	displayName: string;
	avatar: string;
	isHost: boolean;

	constructor({ id, displayName, avatar, isHost }: { id: string; displayName: string; avatar: string; isHost: boolean; }) {
		this.id = id;
		this.displayName = displayName;
		this.avatar = avatar;
		this.isHost = isHost;
	}
}

export enum Status {
	Waiting,
	Started,
	Ended,
}

export type GameState = {
	hostId: string | null;
	code?: string;
	players: Player[];
	lastEventId?: string | null;
	status?: Status;
};
