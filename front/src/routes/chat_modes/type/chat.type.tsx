export type chatPreview = {
    name: string;
    picture?: string;
    updateAt: string;
    lastMsg: string;
    unreadCount?: number;
}

export type newChannel = {
    name: string;
    private: boolean;
    password: string;
    email: string | null;
}

export type updateChannel = {
    channel: string;
    email: string | null;
}

export type useMsg = {
    email: string | null;
    channel: string | undefined;
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
}

export type oneUser = {
    online: boolean;
    username: string;
    picture: string;
}

export type updateUser = {
    self: string | null;
    other: string;

}

export type userSuggest = {
    id: number;
    username: string;
    email: string;
    picture: string;
}

export type roomExist = {
    id: number;
    name: string;
    picture: string;
}