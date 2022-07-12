import "./roomStatus.css";
import { chatPreview } from "./type/chat.type";

export default function RoomStatus({current}:{current: chatPreview | undefined}) {
    return(
        <div className="chat-status-zone">
            <InRoomSearch/>
            <MemberStatus/>
        </div>
    )
}

function InRoomSearch() {
    return (
        <div className="in-room-search">

        </div>
    )
}

function MemberStatus() {
    return (
        <div className="member-status">

        </div>
    )
}