import { useEffect, useState } from "react";
import { socket } from "../../App";
import "./roomStatus.css";
import { chatPreview, oneUser, Tag, updateChannel, updateUser } from "./type/chat.type";
import {
    Menu,
    Item,
    Separator,
    useContextMenu,
    Submenu,
    theme
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";
import { useAuth } from "../..";
import { Router } from "react-router-dom";
import { AddUserIcon, QuitIcon } from "./icon";
import ReactTags from "react-tag-autocomplete";
// import { MENU_USER } from "../Chat";

export const MENU_USER = "menu_user";

declare var global: {
    selectedData: oneUser
}

export default function RoomStatus({current}:{current: chatPreview | undefined}) {
    const [add, setAdd] = useState<boolean>(false);
    const [userTag, setUserTag] = useState<Tag[]>([]);

    const email = useAuth().user;

    useEffect(()=> {

        if (current)
            socket.emit("read room status", current?.id);

        socket.on("user tags", function(data: Tag[]) {
            setUserTag(data);
            console.log("tags", data);
        })

        return (() => {
            socket.off("user tags");
        })

    }, [current])

    const handleInvite = (member: Tag) => {
        setAdd(false);
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            adminEmail: "",
            invitedId: member.id
        }
        socket.emit("invite to channel", update);
        console.log("YOU ADD " + member.name);
    }

    const onDelete = (i: number) => {}

    return(
        <div className="chat-status-zone">
            <div className="status-top">
                    {userTag && userTag.length > 0 && add ?
                    <div className="add-box">
                        <ReactTags
                            tags={[]}
                            suggestions={userTag}
                            placeholderText="invite to chat..."
                            noSuggestionsText="user not found"
                            onAddition={handleInvite}
                            onDelete={onDelete}
                            autofocus={true}
                        />
                        <QuitIcon onClick={() => {
                            setAdd(false) }}/>
                    </div> : <>
                        <AddUserIcon onClick={() => {
                            socket.emit("get user tags");
                            setAdd(true);
                        }}/>
                </>}
            </div>
            <MemberStatus current={current}/>
        </div>
    )
}

function MemberStatus({current}:{current: chatPreview | undefined}) {
    const [owner, setOwner] = useState<oneUser[] | null>([]);
    const [admins, setAdmins] = useState<oneUser[] | null>([]);
    const [members, setMembers] = useState<oneUser[] | null>([]);
    const [inviteds, setInviteds] = useState<oneUser[] | null>([]);

    useEffect( () => {

        socket.on("fetch owner", function(data: oneUser[] | null){
            console.log("got fetched owner", data)
            setOwner(data);
        })

        socket.on("fetch admins", function(data: oneUser[] | null){
            console.log("got fetched admins", data)
            setAdmins(data);
        })

        socket.on("fetch members", function(data: oneUser[] | null){
            console.log("got fetched members", data)
            setMembers(data);
        })

        socket.on("fetch inviteds", function(data: oneUser[] | null){
            console.log("got fetched inviteds", data)
            setInviteds(data);
        })

        return (() => {
            socket.off("fetch owner");
            socket.off("fetch admins");
            socket.off("fetch members");
            socket.off("fetch inviteds");
        })
        
    }, [])
    return (
        <div className="member-status">
            <p className="status-type"
                style={{display: owner?.length ? "" : "none"}}>
                OWNER
            </p>
            <Status users={owner} current={current}/>
            <p 
                className="status-type"
                style={{display: admins?.length ? "" : "none"}}>
                ADMINS
            </p>
            <Status users={admins} current={current}/>
            <p
                className="status-type"
                style={{display: members?.length ? "" : "none"}}>
                MEMBERS
            </p>
            <Status users={members} current={current}/>
            <p
                className="status-type"
                style={{display: inviteds?.length ? "" : "none"}}>
                Invited Users
            </p>
            <Status users={inviteds} current={current}/>
        </div>
    )
}

function Status({users, current}
    : { users: oneUser[] | null,
        current: chatPreview | undefined }) {
    
    const email = useAuth().user;

    function handleAddFriend(){
        let update: updateUser = {
            self: email,
            other: global.selectedData.username
        }
        socket.emit("add friend", update);
    }

    function handleInviteGame(){
        let update: updateUser = {
            self: email,
            other: global.selectedData.username
        }
        socket.emit("invite game", update);
    }

    function handleMute(mins: number){
        let update: updateUser = {
            self: email,
            other: global.selectedData.username
        }
        socket.emit("mute user", update);
    }

    function handleBlock(){
        let update: updateUser = {
            self: email,
            other: global.selectedData.username
        }
        socket.emit("block user", update);
    }

    function handleBeAdmin(){
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            adminEmail: global.selectedData.email,
            invitedId: 0
        }
        console.log("myemail: %s, email: %s", email, global.selectedData.email)
        socket.emit("be admin", update);
    }

    function handleNotAdmin(){
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            adminEmail: global.selectedData.email,
            invitedId: 0
        }
        console.log("myemail: %s, email: %s, ownerEmail: %s", email, global.selectedData.email, current?.ownerEmail)
        socket.emit("not admin", update);
    }

    function handleLeave(){
        let update: updateChannel = {
            channelId: current!.id,
            email: global.selectedData.email,
            adminEmail: "",
            invitedId: 0
        }
        socket.emit("leave channel", update);
    }

    return (
        <>
            {users?.map((value, index) => {
                return (
                <div key={index}>
                    <OneStatus data={value}/>
                </div>
                )
            })}
            <Menu id={MENU_USER} theme={theme.dark}>
                    <Item onClick={handleAddFriend}>
                        add friend
                    </Item>
                    <Item onClick={handleInviteGame}>
                        invite to a game!
                    </Item>
                    
                    <Separator/>
                        <Item 
                            style={{display:
                                (global.selectedData?.isAdmin === false) ? "" : "none"}}
                            onClick={handleBeAdmin}>
                            assign as admin
                        </Item>
                        <Item 
                            style={{display: 
                                (global.selectedData?.isAdmin === true) ? "" : "none"}}
                            onClick={handleNotAdmin}>
                            take back the admin right
                        </Item>
                        <div style={{display: 
                                (email === current?.ownerEmail) ?  "" : "none"}}>
                            <Separator/>
                        </div>
                        <Submenu label="mute" style={{display: 
                                (global.selectedData?.isAdmin) === true ?  "" : "none"}}>
                            <Item 
                                style={{position: "relative", right: "200%"}}
                                onClick={() => handleMute(5)}>
                                5 mins
                            </Item>
                            <Item 
                                style={{position: "relative", right: "200%"}}
                                onClick={() => handleMute(10)}>
                                10 mins
                            </Item>
                            <Item
                                style={{position: "relative", right: "200%"}}
                                onClick={() => handleMute(15)}>
                                15 mins
                            </Item>
                            <Item
                                style={{position: "relative", right: "200%"}}
                                onClick={() => handleMute(20)}>
                                20 mins
                            </Item>
                        </Submenu>
                        <Item onClick={handleBlock}>
                            block
                        </Item>
                        <Item onClick={handleLeave}>
                            kick out
                        </Item>
                </Menu>
        </>
    )
}

function OneStatus({data}
    : { data: oneUser }) {

    const email = useAuth().user;

    const { show } = useContextMenu({
        id: MENU_USER
    });

    const goProfile = () => {
        // link to profile 
    }

        return (
            <div
                style={{display: data ? "" : "none"}}
                className="one-status"
                onContextMenu={email !== data?.email ? (e) => {global.selectedData = data; show(e)} : undefined }
                onClick={goProfile}
                >
                <p className="one-pic">{data?.picture}</p>
                <p className="one-name">{data?.username}</p>
                
            </div>
        )
    }