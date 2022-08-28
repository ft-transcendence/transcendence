import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import { chatPreview } from "./chat_modes/type/chat.type";
import { NewRoomCard } from "./chat_modes/newRoomCard";
import { SettingCard } from "./chat_modes/settingCard";

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
          Token: localStorage.getItem("userToken"),
      }
    }
  },
  path: 'pongchat/socket.io',
};

const socketURL = process.env.REACT_APP_CHAT_SOCKET ? process.env.REACT_APP_CHAT_SOCKET : "";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const socket = io(socketURL, socketOptions);

export default function Chat() {
    const [selectedChat, setSelectedChat] = useState<chatPreview | undefined>(undefined);
    const [newRoomRequest, setNewRoomRequest] = useState(false);
    const [settingRequest, setSettingRequest] = useState(false);
    const [outsider, setOutsider] = useState<boolean | undefined>(undefined);
    const [show, setShow] = useState<boolean | undefined>(undefined);
    const [role, setRole] = useState("");

    useEffect(() => {

        socket.on("connect", () => {
            console.log("front Connected");
        });

        socket.on("exception", (data) => {
            console.log("exception", data);
        })

        socket.on("fetch role", (data) => {
            setRole(data);
        })

        return (() => {
            socket.off("connect");
            socket.off("exception");
            socket.off("fetch role");
        })
    }, [])

    useEffect(() => {
        if (selectedChat)
            setOutsider((role === "invited" || role === "noRole") ? true : false);
    }, [selectedChat, role]);

    useEffect(() => {
        if (selectedChat)
            setShow((!selectedChat.isPassword) || !outsider)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outsider])

    const newRoomCardDisappear = () => {
        setNewRoomRequest(old => {return !old})
    }

    const settingCardDisappear = () => {
        setSettingRequest(old => {return !old})
    }

    return (
        <div className="zone-diff">
                <Preview
                    current={selectedChat}
                    onSelect={(chat) => {
                        setSelectedChat(chat)
                    }}
                    onNewRoomRequest={() => {
                        setNewRoomRequest(old => {return !old})
                    }}
                />
                <ChatRoom
                    current={selectedChat}
                    show={show}
                    role={role}
                    outsider={outsider}
                    setSettingRequest={() => {setSettingRequest(old => {return !old})}}/>
            <div style={{display: selectedChat?.dm ? "none" : "", backgroundColor: "#003e60"}}>
                <RoomStatus
                    current={selectedChat}
                    role={role}
                    outsider={outsider}/>
            </div>
            <div
                onClick={newRoomCardDisappear}
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
            <div
                onClick={settingCardDisappear}
                className="card-disappear-click-zone"
                style={{display: settingRequest ? "" : "none"}}>
                <div 
                    className="add-zone"
                    onClick={event => event.stopPropagation()}>
                        <SettingCard
                        channelId={selectedChat?.id}
                            settingRequest={settingRequest}
                            onSettingRequest={() => {
                                setSettingRequest(old => {return !old})
                        }}/>
                </div>
            </div>
        </div>
    )
}