import { useEffect, useState } from "react";
import { socket } from "../../App";
import { useAuth } from "../../globals/contexts";
import "./chatPreview.css";
import { chatPreview } from "./type/chat.type";

export default function Preview({data, onSelect, current}
    : {data:chatPreview[], onSelect: (chatPreview:chatPreview) => void, current: chatPreview | undefined}) {
    const [items, setItems] = useState<chatPreview[]>([])
    const email = useAuth().user;

    useEffect(() => {
        setItems(data);

        socket.on("updatePreview", function(data) {
            console.log("update preview")
            setItems(data);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createNewChannel = (event: any) => {
        socket.emit("newChannel", {name: "meiiii", private: false, email:email});
        console.log("create channel");
    }
    const joinChannel = (event: any) => {
        socket.emit("joinChannel", {name: "mei"})
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
                        <PreviewChat data={value} onClick={()=>{
                            onSelect(value);
                        }} selected={value === current}/>
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
        className="input-bar"/>

        <button onClick={handleChatSearch} className="search">🔍</button>
        </>
    );
}

function PreviewChat({data, onClick, selected}: {data:chatPreview, onClick?: ()=>void, selected: boolean}) {
    
    return (
        <div className="preview-chat" onMouseUp={onClick} style={{opacity: selected ? 0.7 : 1}}>
            <p className="preview-chat-img">{data.picture}</p>
            <div className="preview-chat-info">
                <div className="preview-chat-info-1">
                    <p className="preview-chat-name">{data.name}</p>
                    <p className="preview-chat-msg">{data.lastMsg}</p>
                </div>
                <div className="preview-chat-info-2">
                    <p className="preview-chat-time">{data.updateAt}</p>
                    {/* <p className="preview-chat-unread">{unreadCount}</p> */}
                </div>
            </div>
        </div>
    );
}