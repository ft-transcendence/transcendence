import { useEffect, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import "./chatPreview.css";
import { chatPreview, newChannel } from "./type/chat.type";

export default function Preview({data}: {data:chatPreview[]}) {
    const [items, setItems] = useState<chatPreview[]>([])
    const email = useAuth().user;

    useEffect(() => {
        setItems(data);

        socket.on("updatePreview", function(data) {
            console.log("update preview")
            setItems(data);
        })
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
            <div className="preview-chat-search"></div>
            <div className="preview-chat-list">
                {items.map((value, index) => {
                    return (<div key={index}>
                        <PreviewChat data={value}/>
                    </div>);
                })}
            </div>
            <button onClick={createNewChannel}> create new channel</button>
            <button onClick={joinChannel}> join channel</button>
        </div>
    )
}



function PreviewChat({data}: {data:chatPreview}) {
    
    return (
        <div className="preview-chat">
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