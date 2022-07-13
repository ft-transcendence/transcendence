import "./chatPreview.css";
import { useEffect, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import { chatPreview, updateChannel } from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";

const MENU_PREVIEW = "menu_preview";

export default function Preview(
    { data, current, onSelect, newRoomRequest, onNewRoomRequest }
    : { data:chatPreview[],
        current: chatPreview | undefined, 
        onSelect: (chatPreview:chatPreview) => void,
        newRoomRequest: boolean,
        onNewRoomRequest: () => void }) {

    const [items, setItems] = useState<chatPreview[]>([]);
    
    useEffect(() => {
        setItems(data);

        socket.on("update preview", function(data) {
            console.log("update preview")
            setItems(data);
        })
        return (() => {
            socket.off("update preview")
        })
    }, [data]);

    return(
        <div className="preview-zone">
            <div className="preview-chat-search">
                <ChatSearch/>
                <CreateRoom
                    onRequest={() => {onNewRoomRequest()}}
                    requested={newRoomRequest}
                />
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
        </div>
    )
}

function CreateRoom({onRequest, requested}
    : {onRequest: () => void, requested: boolean}){

    return (
        <div
            onMouseUp={onRequest}
            className="create-room-button"
            style={{opacity: requested? 0.9 : 1}}
        />
    )
}

function ChatSearch() {
    const [keyWord, setKey] = useState("");

    const handleKeyWord = (event:any) => {
        setKey(event.target.value);
    }

    const handleChatSearch = (event:any) => {
        socket.emit("chat search", keyWord);
        setKey("");
    }
    return (
        
        <textarea 
            value={keyWord}
            onChange={handleKeyWord}
            className="input-search"
            onKeyDown={(e) =>
            {
                if (e.key === "Enter")
                    handleChatSearch(null);
            }}
        />
        
    );
}

function PreviewChat({data, onClick, selected}: {data:chatPreview, onClick?: ()=>void, selected: boolean}) {
    
    const email = useAuth().user;
    console.log("lastmsg", data.lastMsg)
    const { show } = useContextMenu({
        id: MENU_PREVIEW
    });

    function handleDelete(){
        let update: updateChannel = {
            channel: data.name,
            email: email
        }
        socket.emit("delete channel", update);
    }

    function handleBlock(){
        let update: updateChannel = {
            channel: data.name,
            email: email
        }
        socket.emit("block channel", update);
    }

    return (
        <>
            <div
            className="preview-chat"
            onMouseUp={onClick} style={{opacity: selected ? 0.7 : 1}}
            onContextMenu={show}>
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
            <Menu id={MENU_PREVIEW}>
                <Item onClick={handleDelete}>
                    delete
                </Item>
                <Item onClick={handleBlock}>
                    block
                </Item>
            </Menu>
        </>
    );
}