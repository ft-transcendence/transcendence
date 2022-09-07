import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import { chatPreview, gameInvitation } from "./chat_modes/type/chat.type";
import { NewRoomCard } from "./chat_modes/newRoomCard";
import { SettingCard } from "./chat_modes/settingCard";
import { GameRequestCard } from "./chat_modes/gameRequestCard";
import { NotifCxt } from "../App";

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
    const [selectedChat, setSelectedChat] = useState<chatPreview | undefined>(undefined);
    const [newRoomRequest, setNewRoomRequest] = useState(false);
    const [settingRequest, setSettingRequest] = useState(false);
    const [gameRequest, setGameRequest] = useState(false);
    const [gameInfo, setGameInfo] = useState<gameInvitation | undefined>(undefined);
    const [outsider, setOutsider] = useState<boolean | undefined>(undefined);
    const [show, setShow] = useState<boolean | undefined>(undefined);
    const [role, setRole] = useState("");
    const [updateStatus, setUpdateStatus] = useState(0);
    const [blockedList, setBlockedList] = useState<[]>([]);
    const notif = useContext(NotifCxt);
    const email = localStorage.getItem("userEmail");

    useEffect(() => {

        socket.on("connect", () => {
            console.log("front Connected");
        });

        socket.on("exception", (data) => {
            console.log(data)
            if (data.message)
                notif?.setNotifText('error: ' + data.message);
            else
                notif?.setNotifText('error: ' + data);
            notif?.setNotifShow(true);
        })

        socket.on("fetch role", (data) => {
            setRole(data);
        })

        socket.on("game invitation", (game: gameInvitation) => {
            setGameRequest(true);
            setGameInfo(game);
        })

        socket.on("update channel request", () => {
            setUpdateStatus(u => u+1);
        })

        socket.on("fetch blocked", (data: []) => {
            setBlockedList(data);
        })

        return (() => {
            socket.off("connect");
            socket.off("exception");
            socket.off("fetch role");
            socket.off("invite to game");
            socket.off("fetch blocked");
            socket.off("update channel request");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedChat)
        {
            setOutsider((role === "invited" || role === "noRole") ? true : false);
            socket.emit("read blocked", email);
        }
    }, [selectedChat, role, email, updateStatus]);

    useEffect(() => {
        if (selectedChat)
            setShow((!selectedChat.isPassword) || !outsider)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outsider])

    useEffect(() => {
        if (show && selectedChat)
        {
            const cId = selectedChat.id;
            socket.emit("read msgs", cId);
            socket.emit("get setting", cId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateStatus, selectedChat, show]);
    
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
                    updateStatus={updateStatus}
                />
                <ChatRoom
                    current={selectedChat}
                    show={show}
                    role={role}
                    outsider={outsider}
                    setSettingRequest={() => {setSettingRequest(old => {return !old})}}
                    blockedList={blockedList}
                />
            <div style={{display: selectedChat?.dm ? "none" : "", backgroundColor: "#003e60"}}>
                <RoomStatus
                    current={selectedChat}
                    role={role}
                    outsider={outsider}
                    updateStatus={updateStatus}
                    blockedList={blockedList}
                />
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
                            }}
                            updateStatus={updateStatus}
                        />
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
            <div
                className="card-disappear-click-zone"
                style={{display: gameRequest ? "" : "none"}}>
                <div 
                    className="add-zone"
                    onClick={event => event.stopPropagation()}>
                        <GameRequestCard
                            game={gameInfo}
                            gameRequest={gameRequest}
                            onGameRequest={() => {
                                setGameRequest(old => {return !old})
                        }}/>
                </div>
            </div>
        </div>
    )
}