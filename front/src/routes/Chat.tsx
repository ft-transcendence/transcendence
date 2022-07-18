import { useEffect, useState } from "react";
import "./Chat.css";
import { socket } from "../App";
import { useAuth } from "..";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import { chatPreview } from "./chat_modes/type/chat.type";
import { NewRoomCard } from "./chat_modes/newRoomCard";

export default function Chat() {
    const [selectedChat, setSelectedChat] = useState<chatPreview | undefined>(undefined);
    const [newRoomRequest, setNewRoomRequest] = useState(false);

    const email = useAuth().user;

    useEffect(() => {

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
    }, [])

    const cardDisappear = () => {
        setNewRoomRequest(old => {return !old})
    }

    return (
        <div className="zone-diff">
            <Preview
                current={selectedChat}
                onSelect={(chat) => {
                    setSelectedChat(chat)
                }}
                newRoomRequest={newRoomRequest}
                onNewRoomRequest={() => {
                    setNewRoomRequest(old => {return !old})
                }}
            />
            <ChatRoom
                current={selectedChat}/>
            <RoomStatus
                current={selectedChat}/>
            <div
                onClick={cardDisappear}
                className="card-disappear-click-zone"
                style={{display: newRoomRequest ? "" : "none"}}>
                <div 
                    className="add-zone"
                    onClick={event => event.stopPropagation()}>
                        <NewRoomCard
                            newRoomRequest={newRoomRequest}
                            onNewRoomRequest={() => {
                                setNewRoomRequest(old => {return !old})
                        }}/>
                </div>
            </div>
        </div>
    )
}