import { useEffect, useState } from "react";
import "./roomStatus.css";
import { 
    chatPreview, 
    mute, 
    oneUser, 
    Tag, 
    updateChannel, 
    updateUser
} from "./type/chat.type";
import {
    Menu,
    Item,
    Separator,
    useContextMenu,
    Submenu,
    theme
} from "react-contexify";
import "./context.css";
import { AddUserIcon, QuitIcon } from "./icon";
import ReactTags from "react-tag-autocomplete";
import { socket } from "../Chat";
import { getUserAvatarQuery } from "../../queries/avatarQueries";

declare var global: {
    selectedData: oneUser
}

export default function RoomStatus({current, role, outsider}
    : { current: chatPreview | undefined,
        role: string,
        outsider: boolean | undefined}) {
    const [add, setAdd] = useState<boolean>(false);
    const [invitationTag, setTag] = useState<Tag[]>([]);
 
    const email = localStorage.getItem("userEmail");

    useEffect(() => {

        if (current)
        {
            socket.emit("read room status", {id: current?.id, email: email});
            socket.emit("get invitation tags", current!.id);
        }

        socket.on("invitation tags", (data: Tag[]) => {
            setTag(data);
        })

        return (() => {
            socket.off("invitation tags");
        })

    }, [current, email])

    const handleInvite = (member: Tag) => {
        setAdd(false);
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            password: "",
            targetId: member.id,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("invite to channel", update);
    }

    const onDelete = (i: number) => {}

    return(
        <div className="chat-status-zone">
            <div className="status-top">
                { current ?
                    add ?
                        <div className="add-box">
                            <ReactTags
                                tags={[]}
                                suggestions={invitationTag}
                                placeholderText="invite to chat"
                                noSuggestionsText="user not found"
                                onAddition={handleInvite}
                                onDelete={onDelete}
                                autofocus={true}
                                onBlur={() => {
                                    setAdd(false);
                                }}
                            />
                            <QuitIcon onClick={() => {
                                setAdd(false) }}/>
                        </div> :
                        <>
                            <AddUserIcon onClick={() => {
                                setAdd(true);
                            }}/>
                        </>
                    : <></>
                }
            </div>
            <MemberStatus
                current={current}
                role={role}/>
            <JoinChannel
                channelId={current?.id}
                outsider={outsider}
                isPassword={current?.isPassword}/>
        </div>
    )
}

function MemberStatus({current, role}
    : { current: chatPreview | undefined,
        role: string }) {
    const [owner, setOwner] = useState<oneUser[] | null>([]);
    const [admins, setAdmins] = useState<oneUser[] | null>([]);
    const [members, setMembers] = useState<oneUser[] | null>([]);
    const [inviteds, setInviteds] = useState<oneUser[] | null>([]);
    
    useEffect( () => {

        socket.on("fetch owner", (data: oneUser[] | null) => {
            setOwner(data);
        })

        socket.on("fetch admins", (data: oneUser[] | null) => {
            setAdmins(data);
        })

        socket.on("fetch members", (data: oneUser[] | null) => {
            setMembers(data);
        })

        socket.on("fetch inviteds", (data: oneUser[] | null) => {
            setInviteds(data);
        })

        return (() => {
            socket.off("fetch owner");
            socket.off("fetch admins");
            socket.off("fetch members");
            socket.off("fetch inviteds");
        })
        
    }, [current])

    return (
        <div className="member-status">
            <p 
                className="status-type"
                style={{display: owner?.length ? "" : "none"}}>
                OWNER
            </p>
            <Status users={owner} current={current} role={role}/>
            <p 
                className="status-type"
                style={{display: admins?.length ? "" : "none"}}>
                ADMINS
            </p>
            <Status users={admins} current={current} role={role}/>
            <p
                className="status-type"
                style={{display: members?.length ? "" : "none"}}>
                MEMBERS
            </p>
            <Status users={members} current={current} role={role}/>
            <p
                className="status-type"
                style={{display: inviteds?.length ? "" : "none"}}>
                Invited Users
            </p>
            <Status users={inviteds} current={current} role={role}/>
        </div>
    )
}

function Status({users, current, role}
    : { users: oneUser[] | null,
        current: chatPreview | undefined,
        role: string }) {
    
    const email = localStorage.getItem("userEmail");

    const [selData, setSelData] = useState<any>(null);
    const { show } = useContextMenu();
    const [hide, setHide] = useState<any>();
    
    useEffect(() => {

        if (selData && selData.event)
        {
            if (hide)
                hide();
            show(selData.event, {id: JSON.stringify(selData.data)});
            selData.event = null;
        }
    }, [selData, show, hide]);

    function handleAddFriend(){
        let update: updateUser = {
            selfEmail: email,
            otherId: global.selectedData.id
        }
        socket.emit("add friend", update);
    }

    function handleInviteGame(){
        let update: updateUser = {
            selfEmail: email,
            otherId: global.selectedData.id
        }
        socket.emit("invite game", update);
    }

    function handleMute(mins: number){
        let update: mute = {
            duration: mins,
            email: global.selectedData.email,
            chanelId: current!.id
        }
        socket.emit("mute user", update);
    }

    function handleBlockUser(){
        let update: updateUser = {
            selfEmail: email,
            otherId: global.selectedData.id
        }
        socket.emit("block user", update);
    }

    function handleBeAdmin(){
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            password: "",
            targetId: global.selectedData.id,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("be admin", update);
    }

    function handleNotAdmin(){
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            password: "",
            targetId: global.selectedData.id,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("not admin", update);
    }

    function handleKickOut(){
        let update: updateChannel = {
            channelId: current!.id,
            email: email,
            password: "",
            targetId: global.selectedData.id,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("kick out", update);
    }

    return (
        <>
            {users?.map((value, index) => {
                return (
                <div key={index}>
                    <OneStatus data={value} setSelData={setSelData} setHide={setHide}/>
                </div>
                )
            })}
            <Menu id={JSON.stringify(global.selectedData)} theme={theme.dark}>
                <Item onClick={handleAddFriend}>
                    add friend
                </Item>
                <Item onClick={handleInviteGame} style={{backgroundColor: "grey"}}>
                    invite to a game!
                </Item>
                <Item onClick={handleBlockUser}>
                    block user
                </Item>
                <Separator/>
                {role === "owner" && 
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
                {(role === "admin" || role === "owner") && 
                    (global.selectedData?.isInvited === false) ? 
                    <>
                        <Submenu label="mute">
                            <Item 
                                onClick={() => handleMute(5)}>
                                5 mins
                            </Item>
                            <Item 
                                onClick={() => handleMute(10)}>
                                10 mins
                            </Item>
                            <Item
                                onClick={() => handleMute(15)}>
                                15 mins
                            </Item>
                            <Item
                                onClick={() => handleMute(20)}>
                                20 mins
                            </Item>
                        </Submenu>
                        <Item onClick={handleKickOut}>
                            kick out
                        </Item>
                    </> : <></>}
            </Menu>
        </>
    )
}

function OneStatus({data, setSelData, setHide}
    : { data: oneUser,
        setSelData: (d : any) => void,
        setHide: (d: any) => void }) {

    const email = localStorage.getItem("userEmail");
    const [avatarURL, setAvatarURL] = useState("");

    useEffect(() => {

        getAvatar();
      }, [data]);

    const getAvatar = async () => {
        const result: undefined | string | Blob | MediaSource =
            await getUserAvatarQuery(data.id);

        if (result !== undefined && result instanceof Blob) {
            setAvatarURL(URL.createObjectURL(result));
        }
    }

    const goProfile = () => {
        // link to profile 
    }

    const handleMenu = (event: any) => {

        // eslint-disable-next-line react-hooks/rules-of-hooks
        let { hideAll } = useContextMenu({ 
            id: JSON.stringify(global.selectedData)
        });
        setHide(hideAll);
        global.selectedData = data;
        event.preventDefault();
        setSelData({data: data, event: event});
    }

    return (
        <div
            style={{display: data ? "" : "none"}}
            className="one-status"
            onContextMenu={email !== data?.email ? (e) => handleMenu(e) : undefined }
            onClick={goProfile}>
                <p className="one-pic"
                    style={{backgroundImage: `url("${avatarURL}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"}}/>
                <p className="one-name">{data?.username}</p>
        </div>
    )
}

function JoinChannel({channelId, outsider, isPassword}
    : { channelId: number | undefined,
        outsider: boolean | undefined,
        isPassword: boolean | undefined}) {
    const email = localStorage.getItem("userEmail");
    const [password, setPass] = useState("");
    
    const handleSetPass = (event: any) => {
        setPass(event.target.value);
    }

    const handleJoin = () => {    
        let update: updateChannel = {
            channelId: channelId,
            email: email,
            password: password,
            targetId: -1,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("join channel", update);
        setPass("");
    }

    return (
        <div
            style={{display: outsider ? "" : "none"}}>
            <div 
                className="password-zone"
                style={{display: isPassword ? "" : "none"}}>
                    <p
                        className="protected-tag">
                            PROTECTED
                    </p>
                    <p
                        className="password-tag">
                            password
                    </p>
                    <input
                        className="password-input"
                        id="password"
                        value={password}
                        onChange={handleSetPass}
                        placeholder="********"
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                handleJoin()}}/>
            </div>
            <div
                className="join-channel-button"
                style={{display: outsider ? "" : "none"}}
                onMouseUp={handleJoin}>
                join channel
            </div>
        </div>
    )
}