import { useEffect, useState } from "react";
import { socket } from "../../App";
import "./roomStatus.css";
import { chatPreview, oneUser } from "./type/chat.type";

export default function RoomStatus({current}:{current: chatPreview | undefined}) {

    useEffect(()=> {
        if (current)
        {
            const cName = current.name;
            socket.emit("read room status", cName);
        }
    }, [current])
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
    const [admins, setAdmins] = useState<oneUser[]>([]);
    const [members, setMembers] = useState<oneUser[]>([]);

    useEffect( () => {

        socket.on("fetch admins", function(data: oneUser[]){
            console.log("got fetched admins", data)
            setAdmins(data);
        })

        socket.on("fetch members", function(data: oneUser[]){
            console.log("got fetched members", data)
            setMembers(data);
        })

        return (() => {
            socket.off("fetch admins");
        })
        
    }, [])
    return (
        <div className="member-status">
            <p style={{display: admins.length ? "" : "none"}}>admins</p>
            <Status users={admins}/>
            <p style={{display: admins.length ? "" : "none"}}>members</p>
            <Status users={members}/>
        </div>
    )
}

function Status({users}
    : {users: oneUser[]}) {
    return (
        <>
            {users.map((value, index) => {
                return (
                <div key={index}>
                    <OneStatus data={value}/>
                </div>
                )
            })}
        </>
    )
}

function OneStatus({data}
    : {data: oneUser}) {
        return (
            <>
            <div>
                {data.username}
            </div>
            </>
        )
    }