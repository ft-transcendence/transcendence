import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../globals/contexts";
import "./Chat.css";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import { chatPreview } from "./chat_modes/type/chat.type";
import { NewRoomCard } from "./chat_modes/newRoomCard";

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
export const socket = io("ws://localhost:4000", socketOptions);

export default function Chat() {
    const [previewData, setPreview] = useState<chatPreview[]>([]);
    const [selectedChat, setSelectedChat] = useState<chatPreview | undefined>(undefined);
    const [newRoomRequest, setNewRoomRequest] = useState(false); 

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])

    const cardDisappear = () => {
        setNewRoomRequest(old => {return !old})
    }


    return (
        <div className="zone-diff">
            <Preview
                data={previewData}
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