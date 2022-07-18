import "./newRoomCard.css";
import "./tags.css"
import { useEffect, useRef, useState } from "react";
import { socket } from "../../App";
import { newChannel } from "./type/chat.type";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";
import Switch from "react-switch";
import ReactTags, { Tag } from "react-tag-autocomplete";
import { matchSorter } from "match-sorter";
import { useAuth } from "../..";

export function NewRoomCard({newRoomRequest, onNewRoomRequest}
    : { newRoomRequest: boolean,
        onNewRoomRequest: () => void}) {
    const email = useAuth().user;
    const [userTag, setUserTag] = useState<Tag[]>([]);
    const [roomName, setRoomName] = useState("");
    const [roomPass, setRoomPass] = useState("");
    const [isPrivate, setPrivate] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [addedMember, setAddMember] = useState<Tag[]>([]);
    const scroll = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("new room : request:", newRoomRequest)

        if (newRoomRequest === false)
        {   
            initVars();
            console.log("new room : request:", newRoomRequest)
        }

        socket.emit("get user tags");
        socket.on("user tags", (data: Tag[]) => {
            setUserTag(data);
            console.log("tags", data);
        })

        return  (() => {
            socket.off("user tags");
        })
        // @ts-ignore-next-line
    }, [newRoomRequest])

    const onAddMember = (member: Tag) => {
        const members = addedMember.concat(member)
        setAddMember(members);
        console.log("added a member", members)
    }

    const onDeleteMember = (i: number) => {
        const members = addedMember.slice(0);
        members.splice(i, 1);
        setAddMember(members);
    }

    const suggestionsFilter = (searching: string, suggestions: Tag[]) => {
        return matchSorter(suggestions, searching, { keys: ["name"] });
    }

    const handleString = (value: string, setValue: (value: string) => void) => {
        setValue(value);
    }

    const handlePrivate = () => {
        setPrivate(old => {return !old});
    }

    const handleIsPassword = () => {
        setIsPassword(old => {return !old});
    }

    const onCreate = () => {
        let data: newChannel = {
            name: roomName,
            private: isPrivate,
            password: roomPass,
            email: email,
            members: addedMember,
        }
        socket.emit("new channel", data);
        initVars();
        onNewRoomRequest();
        socket.emit("get search suggest", email);
    }

    const initVars = () => {
        setRoomName("");
        setAddMember([]);
        setPrivate(false);
        setIsPassword(false);
        setRoomPass("");
    }

    const autoScroll = () => {
        setTimeout(() => {
            if (scroll.current)
                scroll.current.scrollTop = scroll.current.scrollHeight;
        }, 30);
    }

    return (
        <div className="new-room-request">
            <div className="room-name">
                <input
                    value={roomName}
                    onChange={(e) => handleString(e.target.value, setRoomName)}
                    className="room-name-input"
                    placeholder="room name"
                />
            </div>
            <div 
                className="browse-users"
                ref={scroll}>
                <ReactTags
                    tags={addedMember}
                    suggestions={userTag.filter(v => {return addedMember.filter(v1 => {return v1.id === v.id}).length === 0})}
                    placeholderText="To:"
                    onAddition={onAddMember}
                    onDelete={onDeleteMember}
                    onInput={autoScroll}
                    suggestionsTransform={suggestionsFilter}
                    noSuggestionsText="user not found"
                />
            </div>
            <div className="div-switch">
                <label style={{color: isPrivate? "rgb(0, 136, 0)": ""}}>
                    private
                </label>
                <Switch
                        className="switch"
                        onChange={handlePrivate}
                        checked={isPrivate}
                        checkedIcon={false}
                        uncheckedIcon={false}/>
            </div>
            <div className="div-switch">
                <label style={{color: isPassword? "rgb(0, 136, 0)": ""}}>
                    password
                </label>
                <Switch
                        className="switch"
                        onChange={handleIsPassword}
                        checked={isPassword}
                        checkedIcon={false}
                        uncheckedIcon={false}/>
            </div>
            <div style={{display: isPassword? "" : "none"}}>
                <input
                    value={roomPass}
                    onChange={(e) => handleString(e.target.value, setRoomPass)}
                    className="password"
                    placeholder="********"
                />
            </div>
            <div className="flexBlock">

            </div>
            <div
                onMouseUp={onCreate}
                className="create-room-button">
                    create room
            </div>
        </div>
    )
}
