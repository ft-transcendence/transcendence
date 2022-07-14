export type chatPreview = {
    name: string;
    picture?: string;
    updateAt: string;
    lastMsg: string;
    unreadCount?: number;
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