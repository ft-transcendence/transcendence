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
    isPassword: boolean;
    picture?: string;
    updateAt: string;
    lastMsg: string;
    unreadCount?: number;
    ownerEmail: string;
}

export type newChannel = {
    name: string;
    private: boolean;
    isPassword: boolean;
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
    channelId: number | undefined;
    email: string | null;
    password: string;
    adminEmail: string;
    invitedId: number | string;
    private: boolean;
    isPassword: boolean;
    ownerPassword: string;
    newPassword: string;
}

export type useMsg = {
    email: string | null;
    channelId: number;
    msg: string;
    msgId: number;
}

export type oneMsg = {
    msgId: number;
    id: number;
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

export type updateUser = {
    self: string | null;
    other: string;
}

export type setting = {
    private: boolean;
    isPassword: boolean;
}

export type mute = {
    duration: number;
    email: string;
    chanelId: number;
}