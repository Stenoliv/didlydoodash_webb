export type User = {
	id: string;
	username: string;
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
	owner: OrgMember;
};

export type OrgMember = {
	organisationId: string;
	role: OrgRole;
	user: User
}

export enum OrgRole {
    // Executive & Leadership Roles
    CEO = "CEO",
    
    // Management Roles
    ProjectManager = "Project Manager",
    HRManager = "HR Manager",
    ITManager = "IT Manager",
    
    // Technical Roles
    SeniorSoftwareEngineer = "Senior Software Engineer",
    JuniorSoftwareEngineer = "Junior Software Engineer",
    ITSupport = "IT Support",

    // Human Resources & Administration Roles
    Recruiter = "Recruiter",

    // Role not specified
    NotSpecified = "Not specified"
}

export type Chat = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	members: ChatMember[]
}

export type ChatMember = {
	id: string;
	member: User
}

export type ChatNotification = 
	| ChatCountNotification

export type ChatCountNotification = {
	type: string;
	payload: {
		chatId: string;
		userId: string;
		unreadMessages: number
	};
}

export type WSType = string

export const MessageSend: WSType = "message.send"
export const MessageRead: WSType = "message.read"
export const MessageAll: WSType = "message.all"
export const MessageTyping: WSType = "message.typing"
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

export type WSInputMessageRead = {
	type: WSType;
	roomId: string;
	payload: {
		messageId: string;
	}
}

export type WSResponseMessage = {
	type: WSType;
	roomId: string;
	payload: any;
}

export  type WSChatMessage = {
	id: string;
	roomId: string;
	userId: string;
	message: string;
	createdAt?: number;
	updatedAt?: number;
}