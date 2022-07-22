import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import "./chatRoom.css";
import { 
    chatPreview,
    oneMsg,
    useMsg
} from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu
} from "react-contexify";
import { LockIcon, SettingIcon } from "./icon";
import { SettingCard } from "./settingCard";

const MENU_MSG = "menu_msg";

declare var global: {
    selectedData: oneMsg
}

export default function ChatRoom({current, show}
    : { current: chatPreview | undefined,
        show: boolean | undefined }) {

    const email = useAuth().user;

    useEffect(() => {
        if (show && current)
        {
            const cId = current!.id;
            socket.emit("read msgs", cId);
            console.log("reading msgs", show)
        }
    }, [current])

    return(
        <>
            <div className="chat-room-zone">
                <BriefInfo info = {current}/>
                {
                current ?
                    (show ? 
                        <>
                            <MsgStream email={email} channelId={current!.id}/>
                            <InputArea email = {email} channelId = {current!.id}/>
                        </>
                        :   
                        <LockIcon/>
                    )
                    : <></>
                }
            </div>
        </>
    )
}

function BriefInfo({info}
    :{info: chatPreview | undefined}) {
    return (
        <div className="brief-info">
            <div className="chat-name">
                {info?.name}
            </div>
            <div className="flex-empty-block"/>
            <SettingIcon onClick={SettingCard}/>
        </div>
    )
}

function MsgStream({email, channelId}
    : { email: string | null,
        channelId: number}) {

    const [msgs, setMsgs] = useState<oneMsg[]>([]);
    const scroll = useRef<HTMLDivElement>(null);

    useEffect( () => {
        socket.on("fetch msgs", (data: oneMsg[]) => {
            console.log("got fetched msgs", data)
            setMsgs(data);
        })

        return (() => {
            socket.off("fetch msgs");
        })
        
    }, [])

    const handleDeleteMsg = () => {
        let msg: useMsg = {
            email: email,
            channelId: channelId,
            msgId: global.selectedData.msgId,
            msg: global.selectedData.msg
        }
        console.log("msg", msg)
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
                return (
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

    const { show } = useContextMenu({
        id: MENU_MSG
    });

    return (
        <div className={data.email === email? "msg-owner" : "msg-other"}>
            <div
                className="msg-block"
                onContextMenu={data.email === email? (e) => {global.selectedData = data; show(e)}: undefined}>
                <p className="msg-sender" style={{display: (data.email === email) ? "none" : ""}}>
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
