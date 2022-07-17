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
}

export type newChannel = {
    name: string;
    dm: boolean;
    private: boolean;
    password: string;
    email: string | null;
    members: Tag[];
}

export type Tag = {
    id: number | string;
    name: string;
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
    email: string;
    picture: string;
}

export type updateUser = {
    self: string | null;
    other: string;

}