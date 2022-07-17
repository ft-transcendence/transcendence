import "./chatPreview.css";
import { useEffect, useState } from "react";
import "./chatPreview.css";
import {socket} from "../Chat";
import { chatPreview, newDM, oneSuggestion, updateChannel } from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu
} from "react-contexify";
import "./context.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useAuth } from "../../globals/contexts";

const MENU_PREVIEW = "menu_preview";

export default function Preview ({ current, onSelect, newRoomRequest, onNewRoomRequest }
    : { current: chatPreview | undefined, 
        onSelect: (chatPreview:chatPreview) => void,
        newRoomRequest: boolean,
        onNewRoomRequest: () => void }) {

    const [roomPreview, setPreviews] = useState<chatPreview[]>([]);
    const email = useAuth().user;
    
    useEffect(() => {

        socket.emit("read preview", email);

        socket.on("set preview", function(data: chatPreview[] | null) {
            if (data)
            {
                console.log("chat preview", data);
                setPreviews(data);
            }
            else
                console.log("no preview")
        })
        
        socket.on("add preview", function(data: chatPreview) {
            console.log("add preview", data)
            if (data)
                setPreviews(oldPreviews => [...oldPreviews, data]);
        })

        socket.on("update preview", function(data: chatPreview[] | null) {
            console.log("update preview", data)
            if (data)
                setPreviews(data);
        })

        return (() => {
            socket.off("set preview")
            socket.off("add preview")
            socket.off("update preview")
        })

    }, [email]);

    const addPreview = (channelName: string) => {
        console.log("add preview!!")
        socket.emit("add preview", channelName)
    }

    const search = (channelName: string) => {
        for (let i = 0; i < roomPreview.length; i++)
        {
            if (roomPreview[i].name === channelName)
            {
                onSelect(roomPreview[i]);
                break ;
            }
        }
    }

    return(
        <div className="preview-zone">
            <div className="preview-chat-search">
                <ChatSearch
                    onSearchMyChat={(channelName) => search(channelName)}
                    onSearchPublicChat={(channelName) => addPreview(channelName)}
                />
                <AddRoom
                    onRequest={() => {onNewRoomRequest()}}
                    requested={newRoomRequest}
                />
            </div>
            <div className="preview-chat-list">
                {roomPreview.map((value, index) => {
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

function ChatSearch( { onSearchMyChat, onSearchPublicChat }
    : { onSearchMyChat: (channelName: string) => void,
        onSearchPublicChat: (channelName: string) => void }) {

    const [suggestion, setSug] = useState<oneSuggestion[]>([]);
    const email = useAuth().user;

    useEffect(() => {
        socket.emit("get search suggest", email);
        socket.on("search suggest", function(data: oneSuggestion[]) {
            setSug(data);
            console.log("suggestion", data);
        })

        return  (() => {
            socket.off("search suggest");
        })
    
    }, [email])

    const handleOnSelect = (data: oneSuggestion) => {

        if (data.catagory === "user")
        {
            let dm: newDM = {
                email: email,
                added_id: data.data_id,
            }
            console.log("DM:", dm)
            socket.emit("new dm", dm);
        }
        else if (data.catagory === "my chat")
            onSearchMyChat(data.name);
        else if (data.catagory === "public chat")
            onSearchPublicChat(data.name);
    }

    const formatResult = (data: oneSuggestion) => {
        return (
            <div className="search-result">
                <div className="result-type">
                    <div style={{display: data.catagory === "my chat" ? "" : "none"}}>
                        My Chat
                    </div>
                    <div style={{display: data.catagory === "public chat" ? "" : "none"}}>
                        Public Chat
                    </div>
                    <div style={{display: data.catagory === "user" ? "" : "none"}}>
                        User
                    </div>
                    <p className="result">
                        {data.picture} {data.name}
                    </p>
                </div>
            </div>
          )
    }

    return (
        <div className="input-search">
            <ReactSearchAutocomplete
                items={suggestion}
                fuseOptions={{ keys: ["name"] }}
                onSelect={handleOnSelect}
                autoFocus={true}
                placeholder="search"
                formatResult={formatResult}
                styling={{height: "35px"}}
            />
        </div>
    );
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

function PreviewChat({ data, onClick, selected }
    : { data: chatPreview,
        onClick?: () => void,
        selected: boolean }) {
    
    console.log("lastmsg", data.lastMsg)
    const email = useAuth().user;
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
            onMouseDown={onClick} style={{backgroundColor: selected ? "#738FA7" : ""}}
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