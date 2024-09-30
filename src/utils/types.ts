export type User = {
	username: string;
	id: string;
	email: string;
	avatar?: string;
};

export type Tokens = {
	access: string;
	refresh: string;
}

export type Organisation = {
	id: string;
	name: string;
};

export type Chat = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	members: ChatMember[]
}

export type ChatMember = {
	id: string;
	name: string;
}

export type WSMessage = {
	type: string;
	roomId: string;
	payload: string;
}