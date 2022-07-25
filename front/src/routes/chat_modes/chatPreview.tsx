import "./chatPreview.css";
import { useEffect, useState } from "react";
import { useAuth } from "../..";
import { socket } from "../../App";
import { chatPreview, updateChannel, oneSuggestion, newDM } from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu,
    theme
} from "react-contexify";
import "./context.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const MENU_CHAT = "menu_chat";

declare var global: {
    selectedData: chatPreview
}

export default function Preview ({ current, onSelect, newRoomRequest, onNewRoomRequest}
    : { current: chatPreview | undefined, 
        onSelect: (chatPreview:chatPreview) => void,
        newRoomRequest: boolean,
        onNewRoomRequest: () => void }) {

    const [roomPreview, setPreviews] = useState<chatPreview[]>([]);
    const email = useAuth().user;
    
    useEffect(() => {

        socket.on("connect", () => {
            socket.emit("read preview", email);
        });

        socket.emit("read preview", email);

        socket.on("set preview", (data: chatPreview[] | null) => {
            if (data)
            {
                console.log("chat preview", data);
                setPreviews(data);
            }
            else
                console.log("no preview")
        })
        
        socket.on("add preview", (data: chatPreview) => {
            console.log("add preview", data)
            if (data)
                setPreviews(oldPreviews => [...oldPreviews, data]);
        })

        socket.on("update preview", (data: chatPreview[] | null) => {
            console.log("update preview", data)
            if (data)
                setPreviews(data);
        })

        return (() => {
            socket.off("connect");
            socket.off("set preview");
            socket.off("add preview");
            socket.off("update preview");
        })

    }, [email]);

    const addPreview = (channelId: number) => {
        console.log("add preview!!")
        socket.emit("add preview", channelId)
    }

    const search = (channelId: number) => {
        for (let i = 0; i < roomPreview.length; i++)
        {
            if (roomPreview[i].id === channelId)
            {
                onSelect(roomPreview[i]);
                break ;
            }
        }
    }

    function handleLeave(){
        let update: updateChannel = {
            channelId: global.selectedData.id,
            email: email,
            password: "",
            adminEmail: "",
            invitedId: 0,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("leave channel", update);
    }

    function handleBlockChannel(){
        let update: updateChannel = {
            channelId: global.selectedData.id,
            email: email,
            password: "",
            adminEmail: "",
            invitedId: 0,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        console.log("data", global.selectedData)
        socket.emit("block channel", update);
    }

    function handleBlockUser(){
        let update: updateChannel = {
            channelId: global.selectedData.id,
            email: email,
            password: "",
            adminEmail: "",
            invitedId: 0,
            private: false,
            isPassword: false,
            ownerPassword: "",
            newPassword: ""
        }
        socket.emit("block user", update);
    }

    return(
        <div className="preview-zone">
            <div className="preview-chat-search">
                <ChatSearch
                    onSearchMyChat={(channelId) => search(channelId)}
                    onSearchPublicChat={(channelId) => addPreview(channelId)}
                />
                <AddRoom
                    onRequest={() => {onNewRoomRequest()}}
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
                })
                }
                <Menu id={MENU_CHAT} theme={theme.dark}>
                    <Item
                        style={{display: global.selectedData?.dm === true ?  "" : "none" }}
                        onClick={handleLeave}>
                        Leave chat
                    </Item>
                    <Item
                        style={{display: global.selectedData?.dm === true ? "none" : "" }}
                        onClick={handleLeave}>
                        delete message
                    </Item>
                    <Item 
                        style={{display: global.selectedData?.dm === true ? "" : "none"}}
                        onClick={handleBlockChannel}>
                        Block channel
                    </Item>
                    <Item 
                        style={{display: global.selectedData?.dm === true ? "none" : "" }}
                        onClick={handleBlockUser}>
                        Block user
                    </Item>
                </Menu>
            </div>
        </div>
    )
}

function ChatSearch({onSearchMyChat, onSearchPublicChat}
    : { onSearchMyChat: (channelId: number) => void,
        onSearchPublicChat: (channelId: number) => void }) {

    const [suggestion, setSug] = useState<oneSuggestion[]>([]);
    const email = useAuth().user;

    useEffect(() => {
        socket.emit("get search suggest", email);
        socket.on("search suggest", (data: oneSuggestion[]) => {
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
            onSearchMyChat(data.data_id);
        else if (data.catagory === "public chat")
            onSearchPublicChat(data.data_id);
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

function AddRoom({onRequest}
    : { onRequest: () => void}){

    return (
        <div
            onMouseUp={onRequest}
            className="add-room-button">
                +
            </div>
        
    )
}

function PreviewChat({ data, onClick, selected }
    : { data: chatPreview,
        onClick?: () => void,
        selected: boolean }) {

    const { show } = useContextMenu({
        id: MENU_CHAT
    });

    return (
        <>
            <div
            className="preview-chat"
            onMouseDown={onClick} style={{backgroundColor: selected ? "rgb(255 255 255 / 29%)" : ""}}
            onContextMenu={(e) => {global.selectedData = data; show(e)}}>
                <div>
                    <div className="preview-chat-img">{data.picture? data.picture : null}</div>
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
            </div>
            
        </>
    );
}