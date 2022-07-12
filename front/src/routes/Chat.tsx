import { useEffect, useState } from "react";
import "./Chat.css";
import { socket } from "../App";
import { useAuth } from "..";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import React from "react";
import { chatPreview } from "./chat_modes/type/chat.type";

export default function Chat() {
    const [previewData, setPreview] = useState<chatPreview[]>([]);
    const [selectedChat, setSelectedChat] = useState<chatPreview | undefined>(undefined);

    const email = useAuth().user;

    useEffect(() => {

        init();

        socket.on("setPreview", function(data: never[]) {
            console.log("chatPreview", data);
            setPreview(data);
        })
        return (() => {
            socket.off("setPreview");
        })
    }, [])

    const init = () => {
        socket.emit("readPreview", email);
    }

    return (
        <div className="zone-diff">
        <Preview data={previewData} current={selectedChat} onSelect={(chat) => {
            console.log("Selected")
            setSelectedChat(chat)
        }}/>
        <ChatRoom current={selectedChat}/>
        <RoomStatus/>
        </div>
    )
}