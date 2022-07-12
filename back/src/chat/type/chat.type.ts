export type chatPreview = {
    name: string;
    picture?: string;
    updateAt: string;
    lastMsg: string;
    unreadCount?: number;
}

export type oneMsg = {
    email: string;
    username: string;
    msg: string;
    createAt: string;
    updateAt: string;
}