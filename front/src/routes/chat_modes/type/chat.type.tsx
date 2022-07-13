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
}

export type updateChannel = {
    channel: string;
    email: string | null;
}

export type newMsg = {
    email: string | null;
    channel: string | undefined;
    msg: string;
}

export type oneMsg = {
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
