import { Player } from 'src/game/interfaces/player.interface';

export type oneSuggestion = {
	catagory: string;
	picture: string;
	name: string;
	id: number;
	data_id: number;
};

export type chatPreview = {
	id: number;
	dm: boolean;
	name: string;
	isPassword: boolean;
	updateAt: string;
	lastMsg: string;
	unreadCount?: number;
	ownerEmail: string;
	ownerId: number;
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export type oneMsg = {
	msgId: number;
	id: number;
	channelId: number;
	email: string;
	username: string;
	msg: string;
	createAt: string;
	updateAt: string;
	isInvite: boolean;
};

export type oneUser = {
	online: boolean;
	username: string;
	id: number;
	email: string;
	isOwner: boolean;
	isAdmin: boolean;
	isInvited: boolean;
	isMuted: boolean;
	isFriend: boolean;
};

export type updateUser = {
	selfEmail: string | null;
	otherId: number;
};

export type Tag = {
	id: number;
	name: string;
};

export type updateChannel = {
	channelId: number;
	email: string | null;
	password: string;
	targetId: number;
	private: boolean;
	isPassword: boolean;
	ownerPassword: string;
	newPassword: string;
};

export type mute = {
	duration: number;
	email: string;
	channelId: number;
};

export type gameInvitation = {
	gameInfo: Player;
	targetId: number;
};
