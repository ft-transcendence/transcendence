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

export type newMsg = {
    email: string | null;
    channel: string | undefined;
    msg: string;
}

export type Msg = {
    email: string;
    username: string;
    msg: string;
    createAt: string;
    updateAt: string;
}
