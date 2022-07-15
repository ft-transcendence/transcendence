import { useEffect, useState } from "react";
import { socket } from "../../App";
import "./roomStatus.css";
import { chatPreview, oneUser, updateUser } from "./type/chat.type";
import {
    Menu,
    Item,
    Separator,
    useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";
import { useAuth } from "../..";

const MENU_STATUS = "menu_status";

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
            socket.off("fetch members");
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

    const email = useAuth().user;

    const { show } = useContextMenu({
        id: MENU_STATUS
    });

    function handleAddFriend(){
        let update: updateUser = {
            self: email,
            other: data.username
        }
        socket.emit("add friend", update);
    }

    function handleInviteGame(){
        let update: updateUser = {
            self: email,
            other: data.username
        }
        socket.emit("invite game", update);
    }

    function handleMute(){
        let update: updateUser = {
            self: email,
            other: data.username
        }
        socket.emit("mute user", update);
    }

    function handleBlock(){
        let update: updateUser = {
            self: email,
            other: data.username
        }
        socket.emit("block user", update);
    }
        return (
            <div
                onContextMenu={show}>
                {data.username}

                <Menu id={MENU_STATUS}>
                    <Item onClick={handleAddFriend}>
                        add friend
                    </Item>
                    <Item onClick={handleInviteGame}>
                        invite to a game!
                    </Item>
                <Separator/>
                    <Item onClick={handleMute}>
                        mute
                    </Item>
                    <Item onClick={handleBlock}>
                        block
                    </Item>
            </Menu>
            </div>
        )
    }