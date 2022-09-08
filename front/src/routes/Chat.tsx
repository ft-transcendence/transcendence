import { useContext, useEffect, useState } from "react";
import "./Chat.css";
import Preview from "./chat_modes/chatPreview";
import ChatRoom from "./chat_modes/chatRoom";
import RoomStatus from "./chat_modes/roomStatus";
import { chatPreview } from "./chat_modes/type/chat.type";
import { NewRoomCard } from "./chat_modes/newRoomCard";
import { SettingCard } from "./chat_modes/settingCard";
import { NotifCxt } from "../App";
import { socket } from "../App"

export default function Chat() {
    const [selectedChat, setSelectedChat] = useState<chatPreview | undefined>(undefined);
    const [newRoomRequest, setNewRoomRequest] = useState(false);
    const [settingRequest, setSettingRequest] = useState(false);
    const [outsider, setOutsider] = useState<boolean | undefined>(undefined);
    const [show, setShow] = useState<boolean | undefined>(undefined);
    const [role, setRole] = useState("");
    const [updateStatus, setUpdateStatus] = useState(0);
    const [blockedList, setBlockedList] = useState<[]>([]);
    const notif = useContext(NotifCxt);
    const email = localStorage.getItem("userEmail");

    useEffect(() => {

        socket.on("exception", (data) => {
            if (data.message)
                notif?.setNotifText('error: ' + data.message);
            else
                notif?.setNotifText('error: ' + data);
            notif?.setNotifShow(true);
        })

        socket.on("fetch role", (data) => {
            setRole(data);
        })

        socket.on("fetch blocked", (data: []) => {
            setBlockedList(data);
        })

        socket.on("update channel request", () => {
            setUpdateStatus(u => u+1);
        })

        return (() => {
            socket.off("exception");
            socket.off("fetch role");
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
                    blockedList={blockedList}
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
        </div>
    )
}