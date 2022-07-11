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