import "./chatPreview.css";
import { useEffect, useState } from "react";
import { socket } from "../../App"
import { chatPreview, newDM, fetchDM, oneSuggestion, updateChannel, updateUser } from "./type/chat.type";
import {
    Menu,
    Item,
    useContextMenu,
    theme
} from "react-contexify";
import "./context.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getUserAvatarQuery } from "../../queries/avatarQueries";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MENU_CHANNEL = "menu_channel";
const MENU_DM = "menu_dm";

declare var global: {
    selectedChat: chatPreview
}

export default function Preview ({ current, onSelect, onNewRoomRequest, updateStatus, blockedList}
    : { current: chatPreview | undefined, 
        onSelect: (chatPreview:chatPreview | undefined) => void,
        onNewRoomRequest: () => void,
        updateStatus: number,
        blockedList: []}) {

    const [roomPreview, setPreviews] = useState<chatPreview[]>([]);
    const email = localStorage.getItem("userEmail");
    const { show } = useContextMenu();
    const [hide, setHide] = useState<any>();
    const [menuEvent, setMenuEvent] = useState<any>(null);

    
    useEffect(() => {
        socket.emit("read preview", email, (data: chatPreview[] | null) => {
            if (data)
                setPreviews(data);
        })

        return (() => {
            socket.off("read review");
        })
    }, [updateStatus, email]);

    useEffect(() => {

        socket.on("add preview", (data: chatPreview) => {
            if (data)
                setPreviews(oldPreviews => [...oldPreviews, data]);
        })

        socket.on("update preview", (data: chatPreview[] | null) => {
            if (data)
                setPreviews(data);
        })

        return (() => {
            socket.off("add preview");
            socket.off("update preview");
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (menuEvent)
        {
            if (hide)
                hide();
            show(menuEvent, {id: JSON.stringify(global.selectedChat)});
            setMenuEvent(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockedList, show, hide, current])
        
    const addPreview = (channelId: number) => {
        socket.emit("add preview", {channelId: channelId, email: email})
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
            channelId: global.selectedChat.id,
            dm: global.selectedChat.dm,
            email: email,
            password: "",
            targetId: -1,
            private: false,
            isPassword: false,
            newPassword: ""
        }
        socket.emit("leave channel", update);
        onSelect(undefined);

    }

    function handleBlockChannel(){
        let update: updateChannel = {
            channelId: global.selectedChat.id,
            dm: global.selectedChat.dm,
            email: email,
            password: "",
            targetId: -1,
            private: false,
            isPassword: false,
            newPassword: ""
        }
        socket.emit("block channel", update);
        onSelect(undefined);
    }

    function handleUnblockUser(){
        let update: updateUser = {
            selfEmail: email,
            otherId: global.selectedChat.ownerId
        }
        socket.emit("unblock user", update);
    }
    if (global.selectedChat)
        global.selectedChat.isBlocked = blockedList.find((map: any) => map.id === global.selectedChat.ownerId)!;

    return(
        <div className="preview-zone">
            <div className="preview-chat-search">
                <ChatSearch
                    onSearchMyChat={(channelId) => search(channelId)}
                    onSearchPublicChat={(channelId) => addPreview(channelId)}
                    updateStatus={updateStatus}
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
                            selected={value.id === current?.id}
                            blockedList={blockedList}
                            setHide={setHide} 
                            setMenuEvent={setMenuEvent}
                            />
                    </div>);
                })
                }
                <Menu id={JSON.stringify(global.selectedChat)} theme={theme.dark}>
                    { global.selectedChat?.dm ?
                       
                        <>
                            <Item
                            onClick={handleLeave}>
                            delete message
                            </Item>
                            { global.selectedChat?.isBlocked ? 
                                <Item onClick={handleUnblockUser}>unblock user</Item>
                                    :
                                <Item onClick={handleBlockChannel}>block user</Item>
                            }
                        </>
                        :
                        <>
                            <Item
                                onClick={handleLeave}>
                                Leave chat
                            </Item>
                            <Item 
                                onClick={handleBlockChannel}>
                                Block channel
                            </Item>
                        </>
                    }
                    
                </Menu>
                <Menu id={MENU_DM} theme={theme.dark}>
                    
                </Menu>
            </div>
        </div>
    )
}

function ChatSearch({onSearchMyChat, onSearchPublicChat, updateStatus}
    : { onSearchMyChat: (channelId: number) => void,
        onSearchPublicChat: (channelId: number) => void,
        updateStatus: number}) {

    const [suggestion, setSug] = useState<oneSuggestion[]>([]);
    const email = localStorage.getItem("userEmail");

    useEffect(() => {
        if (updateStatus === 0)
            return;
        socket.emit("get search suggest", email);
    }, [updateStatus, email]);

    useEffect(() => {
        socket.emit("get search suggest", email);
        socket.on("search suggest", (data: oneSuggestion[]) => {
            setSug(data);
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
                targetId: data.data_id,
            }
            socket.emit("new dm", dm, (channelId: number) => {
                let fetch: fetchDM = {
                    channelId: channelId,
                    targetId: data.data_id,
                }
                socket.emit('fetch new DM', fetch);
            });
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
                    <p style={{display: data.catagory === "my chat" ? "" : "none"}}>
                        My Chat
                    </p>
                    <p style={{display: data.catagory === "public chat" ? "" : "none"}}>
                        Public Chat
                    </p>
                    <p style={{display: data.catagory === "user" ? "" : "none"}}>
                        User
                    </p>
                </div>
                    <p className="result">
                        {data.picture} {data.name}
                    </p>
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
    : { onRequest: () => void }){

    return (
        <div
            onMouseUp={onRequest}
            className="add-room-button">
                +
            </div>
        
    )
}

function PreviewChat({ data, onClick, selected, blockedList, setHide, setMenuEvent }
    : { data: chatPreview,
        onClick?: () => void,
        selected: boolean,
        blockedList: [],
        setHide: (d: any) => void,
        setMenuEvent: (event: any) => void,
    }) {

    const [avatarURL, setAvatarURL] = useState("");

    useEffect(() => {
        const getAvatar = async () => {
            const result: undefined | string | Blob | MediaSource =
                await getUserAvatarQuery(data.ownerId);
    
            if (result !== undefined && result instanceof Blob) {
                setAvatarURL(URL.createObjectURL(result));
            }
        }
        getAvatar();
      }, [data.ownerId]);

    const handleMenu = (event: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let { hideAll } = useContextMenu({ 
            id: JSON.stringify(global.selectedChat)
        });
        setHide(hideAll);
        global.selectedChat = data;
        global.selectedChat.isBlocked = blockedList.find((map: any) => map.id === data.ownerId)!;
        setMenuEvent(event);
    }

    return (
        <>
            <div
            className="preview-chat"
            onMouseDown={onClick} style={{backgroundColor: selected ? "rgb(255 255 255 / 29%)" : ""}}
            onContextMenu={(e) => handleMenu(e)}>
                <div>
                    <div className="preview-chat-img"
                        style={{backgroundImage: `url("${avatarURL}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"}}/>
                    <div className="preview-chat-info">
                        <div className="preview-chat-info-1">
                            <p className="preview-chat-name">{data.name}</p>
                            
                            {/* <p className="preview-chat-msg">{data.lastMsg}</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}