import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { socket } from "../App";
import { useAuth } from "..";
import ChatList from "./chat_modes/chatList";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";

export default function Chat() {
    return (
        <div className="zone-diff">
        <ChatList/>
        <ChatRoom/>
        <RoomStatus/>
        </div>
    )
}