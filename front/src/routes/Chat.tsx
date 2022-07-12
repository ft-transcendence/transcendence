import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../globals/contexts";
import "./Chat.css";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import { chatPreview } from "./chat_modes/type/chat.type";

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
          Token: localStorage.getItem("userToken"),
      }
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = io("ws://localhost:4000", socketOptions);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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