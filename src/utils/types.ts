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

export type WSMessage = 
	| WSChatMessage
	| WSUserJoined
	| WSUserLeft

export type WSChatMessage = {
	type: "message.send";
	roomId: string;
	payload: {
		userId: string;
		createdAt?: Date;
		updatedAt?: Date;
		message: string;
	};
}

export type WSUserJoined = {
	type: "user.joined";
	roomId: string;
	payload: {
		userId: string;
	}
}

export type WSUserLeft = {
	type: "user.left";
	roomId: string;
	payload: {
		userId: string;
	}
}