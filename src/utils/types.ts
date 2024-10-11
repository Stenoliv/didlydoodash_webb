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

// Websocket message type
export type WSType = string

/**
 * Project related types
 */
export type Project = {
	id: string;
	createdAt: number;
	updatedAt: number;
	name: string;
	status: ProjectStatus;
	organisationId: string;
	members?: ProjectMember[]
}

export enum ProjectStatus {
	Active = "Active",
	Archived = "Archived",
	Completed = "Completed",
}

export type ProjectMember = {
	projectId: string;
	role: ProjectRole;
	user: User;
}

export enum ProjectRole {
	Admin = "Admin",
	Edit = "Edit",
	View = "View",
}

/**
 * Kanban related types
 */
export type Kanban = {
	id: string;
	createdAt: number;
	updatedAt: number;
	name: string;
	projectId: string;
	status: ProjectStatus
	categories: KanbanCategory[]
}

export type KanbanCategory = {
	id: string;
	createdAt: number;
	updatedAt: number;
	name: string;
	kanbanId: string;
	items: KanbanItem[]
}

export type KanbanItem = {
	id: string;
	createdAt: number;
	updatedAt: number;
	name: string;
}

// Kanban WS messages
export type WSKanbanMessage = 
| WSKanbanInput | WSKanbanResponse


export type WSKanbanInput = {
	type: WSType;
	roomId: string;
	payload: any
}

export type WSKanbanResponse = {
	type: WSType;
	roomId: string;
	payload: any
}

// Kanban ws types
export const JoinKanban: WSType = "kanban.load"
export const EditKanban: WSType = "kanban.edit"
export const DeleteKanban: WSType = "kanban.delete"
// Kanban category ws types
export const NewKanbanCategory: WSType = "kanban.category.new"
export const EditKanbanCategory: WSType = "kanban.category.edit"
export const DeleteKanbanCategory: WSType = "kanban.category.delete"
// Kanban item ws types
export const NewKanbanItem: WSType = "kanban.item.new"
export const EditKanbanItem: WSType = "kanban.item.edit"
export const DeleteKanbanItem: WSType = "kanban.item.delete"

/**
 * Whiteboard related types
 */
export type Whiteboard = {
	id: string;
}

/**
 * Chat related types
 */
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

/**
 * Chat notifications related types
 */
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