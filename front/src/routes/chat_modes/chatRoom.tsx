import { useEffect, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import "./chatRoom.css";
import { chatPreview, oneMsg, newMsg } from "./type/chat.type";
import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";

const MENU_MSG = "menu_msg";

declare var global: {
    selectedData: oneMsg
}

export default function ChatRoom({current}
    : { current: chatPreview | undefined} ) {

    const email = useAuth().user;

    useEffect(()=> {
        console.log("newRoomRequest",newRoomRequest)
        if (current)
        {
            const cName = current.name;
            console.log("current selected")
            socket.emit("read msgs", cName);
        }
    }, [current])

    if (newRoomRequest)
        return (
            <div className="chat-room-zone">
                <NewRoom/>
            </div>
        );

    return(
        <>
            <div className="chat-room-zone">
                <BriefInfo info = {current}/>
                <MsgStream email={email}/>
                <InputArea email = {email} channel = {current?.name}/>
            </div>
        </>
    )
}

function NewRoom() {
    return (
        <>
        </>
    )
}

function BriefInfo({info}
    :{info: chatPreview | undefined}) {
    return (
        <div className="brief-info">
            {info?.name}
        </div>
    )
}

function MsgStream({email}
    :{email: string | null}) {
    const [msgs, setMsgs] = useState<oneMsg[]>([]);

    useEffect( () => {

        socket.on("fetch msgs", function(data: oneMsg[]){
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
            channel: channel,
            msgId: global.selectedData.msgId,
            msg: global.selectedData.msg
        }
        console.log("msg", msg)
        socket.emit("delete msg", msg)
    }

    const handleEditMsg = () => {
        let msg: useMsg = {
            email: email,
            channel: channel,
            msgId: global.selectedData.msgId,
            msg: global.selectedData.msg
        }
        socket.emit("edit msg", msg)
    }
    return (
        <div className="msg-stream">
            {msgs.map((value, index) => {
                return (
                    <div key={index}>
                        <OneMessage data={value} email={email} channel={channel}/>
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

function OneMessage({data, email, channel}
    : { data: oneMsg,
        email: string | null,
        channel: string | undefined}) {

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

function InputArea({channel, email}
    :{channel: string | undefined, email: string | null}) {
    const [msg, setMsg] = useState("");

    const handleSetMsg = (event:any) => {
        setMsg(event.target.value);
    }

    const sendMsg = () => {
        let data: newMsg = {
            email: email,
            channel: channel,
            msg: msg,
        };
        socket.emit("msg", data);
        setMsg("");
    }

    return (
        <div className="input-zone">
            <textarea
                value={msg}
                onChange={handleSetMsg}
                className="msg-input-area"
                onKeyDown={(e) => {
                    if (e.key === "Enter")
                        sendMsg()}}/>
            <button
                onClick={sendMsg}
                className="send-msg-button">
                send
            </button>
        </div>
    )
}
