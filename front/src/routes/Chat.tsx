import { io } from "socket.io-client";
import "./Chat.css";
import ChatList from "./chat_modes/chatList";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";

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
    return (
        <div className="zone-diff">
        <ChatList/>
        <ChatRoom/>
        <RoomStatus/>
        </div>
    )
}