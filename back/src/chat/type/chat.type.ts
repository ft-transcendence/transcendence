export type oneSuggestion = {
    catagory: string;
    picture: string;
    name: string;
    id: number;
    data_id: number;
}

export type chatPreview = {
    id: number;
    dm: boolean;
    name: string;
    picture?: string;
    updateAt: string;
    lastMsg: string;
    unreadCount?: number;
    ownerEmail: string; 
}

export type oneMsg = {
    msgId: number;
    email: string;
    username: string;
    msg: string;
    createAt: string;
    updateAt: string;
    isInvite: boolean;
}

export type oneUser = {
    online: boolean;
    username: string;
    email: string;
    picture: string;
    isOwner: boolean;
    isAdmin: boolean;
    isInvited: boolean;
    isMuted: boolean;
}

export type Tag = {
    id: number;
    name: string;
}

export type updateChannel = {
    channelId: number;
    email: string | null;
    adminEmail: string;
    invitedId: number;
}