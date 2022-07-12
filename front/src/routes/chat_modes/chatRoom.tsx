import "./chatRoom.css";
import { chatPreview } from "./type/chat.type";


export default function ChatRoom({current}:{current: chatPreview | undefined}) {
    console.log(current);
    return(
        <div className="chat-room-zone">
            <BriefInfo info= {current}/>
            <MsgStream info= {current}/>
            <InputArea/>
        </div>
    )
}

function BriefInfo({info}:{info: chatPreview | undefined}) {
    return (
        <div className="brief-info">

        </div>
    )
}

function MsgStream({info}:{info: chatPreview | undefined}) {
    return (
        <div className="msg-stream">

        </div>
    )
}

function InputArea() {
    return (
        <div className="msg-input-area">

        </div>
    )
}
