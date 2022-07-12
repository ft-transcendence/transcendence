import "./chatPreview.css";
import { useEffect, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import { chatPreview } from "./type/chat.type";

export default function Preview({data, onSelect, current}
    : {data:chatPreview[], onSelect: (chatPreview:chatPreview) => void, current: chatPreview | undefined}) {
    const [items, setItems] = useState<chatPreview[]>([])
    const email = useAuth().user;

    useEffect(() => {
        setItems(data);

        socket.on("update preview", function(data) {
            console.log("update preview")
            setItems(data);
        })


    }, [data]);

    const createNewChannel = (event: any) => {
        socket.emit("new channel", {name: "merr", private: false, email:email});
        console.log("create channel");
    }
    const joinChannel = (event: any) => {
        socket.emit("join channel", {name: "meii", email:email})
    }

    return(
        <div className="preview-zone">
            <div className="preview-chat-search">
                <ChatSearch/>
            </div>
            <div className="preview-chat-list">
                {items.map((value, index) => {
                    return (
                    <div key={index}>
                        <PreviewChat
                            data={value} 
                            onClick={()=>{onSelect(value)}}
                            selected={value === current}/>
                    </div>);
                })}
            </div>
            <button onClick={createNewChannel}> create new channel</button>
            <button onClick={joinChannel}> join channel</button>
        </div>
    )
}

function ChatSearch() {
    const [keyWord, setKey] = useState("");

    const handleKeyWord = (event:any) => {
        setKey(event.target.value);
    }

    const handleChatSearch = (event:any) => {
        socket.emit("chatSearch", keyWord);
        setKey("");
    }
    return (
        <>
        <textarea 
        value={keyWord}
        onChange={handleKeyWord}
        className="input-search"/>

        <button onClick={handleChatSearch} className="search-button">🔍</button>
        </>
    );
}

function PreviewChat({data, onClick, selected}: {data:chatPreview, onClick?: ()=>void, selected: boolean}) {
    console.log("lastmsg", data.lastMsg)
    return (
        <div className="preview-chat" onMouseUp={onClick} style={{opacity: selected ? 0.7 : 1}}>
             <p className="preview-chat-img">{data.picture? data.picture : null}</p>
            <div className="preview-chat-info">
                <div className="preview-chat-info-1">
                    <p className="preview-chat-name">{data.name}</p>
                    
                    <p className="preview-chat-msg">{data.lastMsg}</p>
                </div>
                {/* <div className="preview-chat-info-2">
                    <p className="preview-chat-time">{data.updateAt}</p>
                    <p className="preview-chat-unread">{unreadCount}</p>
                </div> */}
            </div>
        </div>
    );
}