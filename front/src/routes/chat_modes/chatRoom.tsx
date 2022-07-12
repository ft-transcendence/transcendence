import "./chatRoom.css";
import { chatPreview } from "./type/chat.type";


export default function ChatRoom({current}:{current: chatPreview | undefined}) {
    console.log(current);
    return(
        <div className="chat-room">chat room</div>
    )
}