import { useEffect, useRef, useState } from "react";
import { socket } from "../../App"
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
import { EmojiIcon, LockIcon, SettingIcon } from "./icon";
import Picker from 'emoji-picker-react';

const MENU_MSG = "menu_msg";

declare var global: {
    selectedData: oneMsg
}

export default function ChatRoom({current, show, role, outsider, setSettingRequest, blockedList}
    : { current: chatPreview | undefined,
        show: boolean | undefined,
        role: string,
        outsider: boolean | undefined,
        setSettingRequest: () => void,
        blockedList: []}) {

        const email = localStorage.getItem("userEmail");
    
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
                            <MsgStream email={email} channelId={current!.id} blockedList={blockedList}/>
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

function MsgStream({email, channelId, blockedList}
    : { email: string | null,
        channelId: number,
        blockedList: []}) {

    const [msgs, setMsgs] = useState<oneMsg[]>([]);
    const scroll = useRef<HTMLDivElement>(null);

    useEffect( () => {
       
        socket.on("fetch msgs", (data: oneMsg[]) => {
            setMsgs(data);
        })

        socket.on("broadcast", (msg: oneMsg) => {
            if (msg.channelId === channelId)
                setMsgs(oldMsgs => [...oldMsgs, msg]);
        })

        return (() => {
            socket.off("fetch msgs");
            socket.off("broadcast");
        })

    }, [channelId, msgs])

    const handleDeleteMsg = () => {
        let msg: useMsg = {
            email: email,
            channelId: channelId,
            msgId: global.selectedData.msgId,
            msg: global.selectedData.msg
        }
        socket.emit("delete msg", msg)
    }

    setTimeout(()=>{
        if (scroll.current)
            scroll.current.scrollTop = scroll.current.scrollHeight;
    }, 30);

    return (
        <div 
            className="msg-stream" ref={scroll}>
            {
                msgs.map((value, index) => {
                    const isBlocked = blockedList.find((blocked: any) => {
                        return value.id === blocked.id
                    });
                    return (
                        isBlocked ?
                        <div key={index}></div> :
                        <div key={index}>
                            <OneMessage data={value} email={email}/>
                        </div>
                        
                    )
                })
            }
            <Menu id={MENU_MSG} style={{width: "120px", minWidth: "120px"}}>
                <Item onClick={handleDeleteMsg}>
                    unsend
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
    const [mypicker, setMyPicker] = useState(false);

    useEffect(() => {
        setMsg("");
    }, [channelId])

    const handleSetMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const emojiDisappear = () => {
        setMyPicker(old => {return !old})
    }


    return (
        <>
            {mypicker ?
                <div onClick={emojiDisappear} className="emoji-disappear-click-zone"/>: <></>}
            <div
                className="msg-input-zone">
                <input
                    id="msg"
                    value={msg}
                    onChange={handleSetMsg}
                    className="msg-input-area"
                    placeholder="Enter a message"
                    autoComplete="off"
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            sendMsg()}}/>
                <div className="emoji-button" onMouseDown={() => {
                    setMyPicker(b => !b)}}>
                    <EmojiIcon/>
                </div>
                {
                    mypicker ?
                        <div className="pickerBox" style={{display: mypicker ? "absolute" : "none"}}>
                            <Picker onEmojiClick={(e, emoji)=>{
                                setMsg(msg => msg + emoji?.emoji);
                                setMyPicker(false);
                            }} pickerStyle={{boxShadow: "0 5px 19px #00000024"}}/>
                        </div>
                        :
                        <></>
                }
            </div>
        </>
    )
}
