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

        socket.emit("read preview", email);

        socket.on("set preview", function(data: chatPreview[] | null) {
            
            if (data)
            {   
                console.log("chat preview", data);
                setPreview(data);
            }
            else
                console.log("no preview")
        })

        socket.on("connect", () => {
            console.log("front Connected");
        });

        socket.on("exception", function(data) {
            console.log("exception", data)
        })

        return (() => {
            socket.off("set preview");
            socket.off("connect");
            socket.off("exception");
        })
    }, [email])

    return (
        <div className="zone-diff">
        <Preview
            data={previewData}
            current={selectedChat}
            onSelect={(chat) => {
                console.log("Selected")
                setSelectedChat(chat)
            }}
        />
        <ChatRoom current={selectedChat}/>
        <RoomStatus current={selectedChat}/>
        </div>
    )
}