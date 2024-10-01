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
	member: {
		id: string;
		username: string;
	}
}

export type WSType = string

export const MessageSend: WSType = "message.send"
export const MessageAll: WSType = "message.all"
export const MessageError: WSType = "message.error"

export type WSMessage = 
	| WSInputMessage
	| WSResponseMessage

export type WSInputMessage = {
	type: WSType;
	roomId: string;
	payload: {
		id: string;
		message: string;
	};
}

export type WSResponseMessage = {
	type: WSType;
	roomId: string;
	payload: any;
}
