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
import { AddUserIcon, QuitIcon } from "./icon";
import ReactTags from "react-tag-autocomplete";
import { channel } from "diagnostics_channel";

declare var global: {
    selectedData: oneUser
}

export default function RoomStatus({current}:{current: chatPreview | undefined}) {
    const [add, setAdd] = useState<boolean>(false);
    const [userTag, setUserTag] = useState<Tag[]>([]);
    const [joinable, setJoinable] = useState(false);

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

    console.log("jnn ", joinable)

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
            <MemberStatus current={current} joinable={joinable} setJoinable={setJoinable}/>
            <JoinChannel channelId={current?.id} joinable={joinable}/>
        </div>
    )
}

function JoinChannel({channelId, joinable}
    : { channelId: number | undefined,
        joinable: boolean}) {
    const email = useAuth().user;

    const handleJoin = () => {    
        let update: updateChannel = {
            channelId: channelId,
            email: email,
            adminEmail: "",
            invitedId: ""
        }
        socket.emit("join channel", update)
    }

    return (
    <div
        style={{display: joinable ? "" : "none"}}
        className="join-channel-button"
        onMouseUp={handleJoin}>
            join channel
    </div>)
}

function MemberStatus({current, joinable, setJoinable}
    : { current: chatPreview | undefined,
        joinable: boolean,
        setJoinable:(value: boolean) => void}) {
    const [owner, setOwner] = useState<oneUser[] | null>([]);
    const [admins, setAdmins] = useState<oneUser[] | null>([]);
    const [members, setMembers] = useState<oneUser[] | null>([]);
    const [inviteds, setInviteds] = useState<oneUser[] | null>([]);
    const [myRole, setMyRole] = useState("");;
    const email = useAuth().user;

    
    useEffect( () => {

        socket.on("fetch owner", (data: oneUser[] | null) => {
            console.log("got fetched owner", data)
            setOwner(data);
        })

        socket.on("fetch admins", (data: oneUser[] | null) => {
            console.log("got fetched admins", data)
            setAdmins(data);
        })

        socket.on("fetch members", (data: oneUser[] | null) => {
            console.log("got fetched members", data)
            setMembers(data);
        })

        socket.on("fetch inviteds", (data: oneUser[] | null) => {
            console.log("got fetched inviteds", data)
            setInviteds(data);
        })

        return (() => {
            socket.off("fetch owner");
            socket.off("fetch admins");
            socket.off("fetch members");
            socket.off("fetch inviteds");
        })
        
    }, [current])

    useEffect(() => {
        setRole();
    }, [owner, admins, members, inviteds]);

    useEffect(() => {
        setJoinable((myRole === "invited" || myRole === "noRole") && current ? true : false);
    }, [myRole]);

    const setRole = () => {
        setMyRole("noRole")
        if (inviteds && inviteds.length > 0)
        {   
            const isInvited: number = inviteds.filter((invited) => { 
                return invited.email === email }).length;
            if (isInvited > 0)
                setMyRole("invited")
        }
        if (members && members.length > 0)
        {
            const isMember: number = members.filter((member) => { 
                return member.email === email }).length;
            if (isMember > 0)
                setMyRole("member")
        }
        if (admins && admins.length > 0)
        {
            const isAdmin: number = admins.filter((admin) => { 
                return admin.email === email }).length;
            if (isAdmin > 0)
                setMyRole("admin")
        }
        if (owner && owner.length > 0)
        {
            const isOwner: number = owner.filter((owner) => { 
                return owner.email === email }).length;
            if (isOwner > 0)
                setMyRole("owner")
        }
        console.log("roleee", myRole)
    }

    

    return (
        <div className="member-status">
            <p 
                className="status-type"
                style={{display: owner?.length ? "" : "none"}}>
                OWNER
            </p>
            <Status users={owner} current={current} myRole={myRole}/>
            <p 
                className="status-type"
                style={{display: admins?.length ? "" : "none"}}>
                ADMINS
            </p>
            <Status users={admins} current={current} myRole={myRole}/>
            <p
                className="status-type"
                style={{display: members?.length ? "" : "none"}}>
                MEMBERS
            </p>
            <Status users={members} current={current} myRole={myRole}/>
            <p
                className="status-type"
                style={{display: inviteds?.length ? "" : "none"}}>
                Invited Users
            </p>
            <Status users={inviteds} current={current} myRole={myRole}/>
        </div>
    )
}

function Status({users, current, myRole}
    : { users: oneUser[] | null,
        current: chatPreview | undefined,
        myRole: string }) {
    
    const email = useAuth().user;

    const [selData, setSelData] = useState<any>(null);
    const { show } = useContextMenu();

    useEffect(() => {
        if (selData && selData.event)
        {
            show(selData.event, {id: JSON.stringify(selData.data)});
            selData.event = null;
        }
    }, [selData]);

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
                    <OneStatus data={value} setSelData={setSelData}/>
                </div>
                )
            })}
            <Menu id={JSON.stringify(global.selectedData)} theme={theme.dark}>
                    <Item onClick={handleAddFriend}>
                        add friend
                    </Item>
                    <Item onClick={handleInviteGame}>
                        invite to a game!
                    </Item>
                    <Item onClick={handleBlock}>
                        block user
                    </Item>
                    <Separator/>
                    {myRole === "owner" && 
                        (global.selectedData?.isInvited === false) ?
                    <>
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
                            unset admin right
                        </Item>
                    </> : <></>}
                    {(myRole === "admin" || myRole === "owner") && 
                        (global.selectedData?.isInvited === false) ? 
                    <>
                        <Submenu label="mute">
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
                    <Item onClick={handleLeave}>
                        kick out
                    </Item>
                        </> : <></>}
            </Menu>
        </>
    )
}

function OneStatus({data, setSelData}
    : { data: oneUser, setSelData: (d : any) => void }) {

    const email = useAuth().user;


    const goProfile = () => {
        // link to profile 
    }

    return (
        <div
            style={{display: data ? "" : "none"}}
            className="one-status"
            onContextMenu={email !== data?.email ? (e) => {global.selectedData = data; e.preventDefault(); setSelData({data: data, event: e});} : undefined }
            onClick={goProfile}>
                <p className="one-pic">{data?.picture}</p>
                <p className="one-name">{data?.username}</p>
        </div>
    )
}
