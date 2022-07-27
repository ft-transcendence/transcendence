import { useEffect, useRef, useState } from "react";
import { socket } from "../Chat";
import "./chatRoom.css";
import { 
    chatPreview,
    oneMsg,
    Tag,
    useMsg
} from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu
} from "react-contexify";
import { LockIcon, SettingIcon } from "./icon";
import { useAuth } from "../../globals/contexts";

const MENU_MSG = "menu_msg";

declare var global: {
    selectedData: oneMsg
}

export default function ChatRoom({current, show, role, outsider, setSettingRequest}
    : { current: chatPreview | undefined,
        show: boolean | undefined,
        role: string,
        outsider: boolean | undefined,
        setSettingRequest: () => void}) {

        const [blocked, setBlocked] = useState<Tag[]>([]);
        const email = useAuth().user;

    useEffect(() => {

        socket.on("connect", () => {
            socket.emit("read blocked", email);
        });

        socket.on("fetch blocked", (data: Tag[]) => {
            setBlocked(data);
        })

        if (show && current)
        {
            const cId = current.id;
            socket.emit("read msgs", cId);
            socket.emit("get setting", cId);
        }

        return (() => {
            socket.off("connect")
            socket.off("fetch blocked");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, current])

    return(
        <>
            <div className="chat-room-zone">
                <BriefInfo
                    info = {current}
                    role={role}
                    setSettingRequest={setSettingRequest}/>
                {
                current ?
                    (show ? 
                        <>
                            <MsgStream email={email} channelId={current!.id} blocked={blocked}/>
                            :
                            <></>
                        </>
                        :   
                        <LockIcon/>
                    )
                    : <></>
                }
                {current && show && !outsider ? 
                    <>
                        <InputArea email = {email} channelId = {current!.id}/>
                    </> : <></>}
            </div>
        </>
    )
}

function BriefInfo({info, role, setSettingRequest}
    : { info: chatPreview | undefined,
        role: string,
        setSettingRequest: () => void}) {
        
    return (
        <div className="brief-info">
            <div className="chat-name">
                {info?.name}
            </div>
            <div className="flex-empty-block"/>
            <div
                style={{display: role === "owner" && !info?.dm ? "" : "none"}}>
            <SettingIcon onClick={() => {setSettingRequest()}}/>

            </div>
        </div>
    )
}

function MsgStream({email, channelId, blocked}
    : { email: string | null,
        channelId: number,
        blocked: Tag[]}) {

    const [msgs, setMsgs] = useState<oneMsg[]>([]);
    const scroll = useRef<HTMLDivElement>(null);

    useEffect( () => {
       
        socket.on("fetch msgs", (data: oneMsg[]) => {
            setMsgs(data);
        })

        socket.on("broadcast", (msg: oneMsg) => {
            setMsgs(oldMsgs => [...oldMsgs, msg]);
        })

        return (() => {
            socket.off("fetch msgs");
            socket.off("broadcast");
        })
        
    }, [])

    const handleDeleteMsg = () => {
        let msg: useMsg = {
            email: email,
            channelId: channelId,
            msgId: global.selectedData.msgId,
            msg: global.selectedData.msg
        }
        socket.emit("delete msg", msg)
    }

    const handleEditMsg = () => {
        let msg: useMsg = {
            email: email,
            channelId: channelId,
            msgId: global.selectedData.msgId,
            msg: global.selectedData.msg
        }
        socket.emit("edit msg", msg)
    }

    setTimeout(()=>{
        if (scroll.current)
            scroll.current.scrollTop = scroll.current.scrollHeight;
    }, 30);


    return (
        <div 
            className="msg-stream" ref={scroll}>
            {msgs.map((value, index) => {
                const isBlocked = blocked.find((blocked) => {
                    return value.id === blocked.id
                });
                return (
                    isBlocked ?
                    <></> :
                    <div key={index}>
                        <OneMessage data={value} email={email}/>
                    </div>
                    
                )
            })}
            <Menu id={MENU_MSG}>
                <Item onClick={handleDeleteMsg}>
                    unsend
                </Item>
                <Item onClick={handleEditMsg}>
                    edit
                </Item>
            </Menu>
        </div>
    )
}

function OneMessage({data, email}
    : { data: oneMsg,
        email: string | null}) {
    const [sender, setSender] = useState("");

    const { show } = useContextMenu({
        id: MENU_MSG
    });

    useEffect(() => {
        if (data.email === email)
            setSender("self")
        else
            setSender("other")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div className={sender}>
            <div
                className="msg-block"
                onContextMenu={sender === "self" ? (e) => {global.selectedData = data; show(e)}: undefined}>
                <p className="msg-sender" style={{display: sender === "self" ? "none" : ""}}>
                    {data.username}
                </p>
                <p className="msg-string">
                    {data.msg}
                </p>
                <p className="msg-sent-time">
                    {data.updateAt}
                </p>
            </div>
        </div>
    )
}

function InputArea({channelId, email}
    : { channelId: number,
        email: string | null }) {
    const [msg, setMsg] = useState("");

    const handleSetMsg = (event:any) => {
        setMsg(event.target.value);
    }

    const sendMsg = () => {
        let data: useMsg = {
            email: email,
            channelId: channelId,
            msg: msg,
            msgId: 0
        };
        socket.emit("msg", data);
        setMsg("");
    }

    return (
        <div
            className="msg-input-zone">
            <input
                id="msg"
                value={msg}
                onChange={handleSetMsg}
                className="msg-input-area"
                placeholder="Enter a message"
                onKeyDown={(e) => {
                    if (e.key === "Enter")
                        sendMsg()}}/>
        </div>
    )
}
