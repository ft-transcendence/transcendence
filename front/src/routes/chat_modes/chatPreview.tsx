import "./chatPreview.css";
import { useEffect, useState } from "react";
import "./chatPreview.css";
import {socket} from "../Chat";
import { chatPreview, userSuggest } from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

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
                <AddRoom
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

function AddRoom({onRequest, requested}
    : {onRequest: () => void, requested: boolean}){

    return (
        <div
            onMouseUp={onRequest}
            className="add-room-button"
            style={{opacity: requested? 1 : 0.6}}>+</div>
        
    )
}

function ChatSearch() {
    const [userSug, setUserSug] = useState<userSuggest[]>([]);
    const [keyWord, setKey] = useState("");


    useEffect(() => {
        socket.emit("get suggest users");
        // socket.emit("get existed rooms");
        socket.on("suggest users", function(data) {
            setUserSug(data);
            console.log("users", userSug);
        })
        // socket.on("existed rooms", function(data) {
        //     setRoomExist(data);
        //     console.log("rooms", roomExi);
        // })
        socket.on("exception", function(data){
            console.log(data)
        })
        return  (() => {
            socket.off("get suggest users");
            // socket.off("get existed rooms");
            socket.off("exception")
        })
        // @ts-ignore-next-line
    }, [])
    const handleOnSelect = (user:userSuggest) => {
        socket.emit("chat search", user);
    }

    const formatResult = (user: userSuggest) => {
        return (
            <>
              {user.picture} {user.username} exists already
            </>
          )
    }
    return (
        <div className="input-search">
            <ReactSearchAutocomplete
                items={userSug}
                fuseOptions={{ keys: ["username", "email"] }}
                onSelect={handleOnSelect}
                autoFocus={true}
                placeholder="search"
                resultStringKeyName="username"
                formatResult={formatResult}
                styling={{height: "35px", color: "white"}}
            />
        </div>
    );
}

function PreviewChat({data, onClick, selected}: {data:chatPreview, onClick?: ()=>void, selected: boolean}) {
    
    console.log("lastmsg", data.lastMsg)
    const { show } = useContextMenu({
        id: MENU_PREVIEW
    });

    function handleDelete(){
        // let update: updateChannel = {
        //     channel: data.name,
        //     email: email
        // }
        // socket.emit("delete channel", update);
    }

    function handleBlock(){
        // let update: updateChannel = {
        //     channel: data.name,
        //     email: email
        // }
        // socket.emit("block channel", update);
    }

    return (
        <>
            <div
            className="preview-chat"
            onMouseUp={onClick} style={{backgroundColor: selected ? "#738FA7" : ""}}
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