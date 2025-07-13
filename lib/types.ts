export class Player {
	id: string;
	displayName: string;
	avatar: string;

	constructor({ id, displayName, avatar }: { id: string; displayName: string; avatar: string; }) {
		this.id = id;
		this.displayName = displayName;
		this.avatar = avatar;
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
