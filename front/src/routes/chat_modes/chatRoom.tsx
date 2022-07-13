import { useEffect, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import "./chatRoom.css";
import { chatPreview, oneMsg, newMsg } from "./type/chat.type";

export default function ChatRoom({current}:{current: chatPreview | undefined}) {
    const email = useAuth().user;

    useEffect(()=> {
        if (current)
        {
            const cName = current.name;
            console.log("current selected")
            socket.emit("read msgs", cName);
        }
    }, [current])
    return(
        <div className="chat-room-zone">
            <BriefInfo info = {current}/>
            <MsgStream email={email}/>
            <InputArea email = {email} channel = {current?.name}/>
        </div>
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
    return (
        <div className="msg-stream">
            {msgs.map((value, index) => {
                return (
                    <div key={index}>
                        <OneMessage data={value} email={email}/>
                    </div>
                )
            })}
        </div>
    )
}

function OneMessage({data, email}
    : {data: oneMsg, email: string | null}) {
    return (
        <div className={data.email === email? "msg-owner" : "msg-other"}>
            <div className="msg-block">
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
                className="msg-input-area"/>
            <button
                onClick={sendMsg}
                className="send-msg-button">
                send
            </button>
        </div>
    )
}
