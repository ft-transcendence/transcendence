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

export type newChannel = {
    name: string;
    private: boolean;
    password: string;
    email: string | null;
    members: Tag[];
}

export type newDM = {

    email: string | null;
    added_id: number;
}

export type Tag = {
    id: number | string;
    name: string;
}

export type updateChannel = {
    channelId: number;
    email: string | null;
    adminEmail: string;
    invitedId: number | string;
}

export type useMsg = {
    email: string | null;
    channelId: number;
    msg: string;
    msgId: number;
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
    isMuted: boolean;
}

export type updateUser = {
    self: string | null;
    other: string;
}