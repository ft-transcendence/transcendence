import "./newRoom.css";
import "./tags.css"
import { useEffect, useRef, useState } from "react";
import { socket } from "../../App";
import { newChannel, roomExist, userSuggest } from "./type/chat.type";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";
import Switch from "react-switch";
import ReactTags, { Tag } from "react-tag-autocomplete";
import { matchSorter } from "match-sorter";
import { useAuth } from "../..";

export function NewRoom({onNewRoomRequest}
    : {onNewRoomRequest: () => void}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const email = useAuth().user;
    const [userTag, setUserTag] = useState<Tag[]>([]);
    const [roomName, setRoomName] = useState("");
    const [roomPass, setRoomPass] = useState("");
    const [isPrivate, setPrivate] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [addedMember, setAddMember] = useState<Tag[]>([]);

    useEffect(() => {
        socket.emit("get user tags");
        socket.on("user tags", function(data: Tag[]) {
            setUserTag(data);
            console.log("tags", data);
        })
        socket.on("exception", function(data){
            console.log(data)
        })
        return  (() => {
            socket.off("user tags");
            socket.off("exception")
        })
        // @ts-ignore-next-line
    }, [])

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
    }

    const initVars = () => {
        setRoomName("");
        setRoomPass("");
        setPrivate(false);
        setIsPassword(false);
        setRoomPass("");
    }

    return (
        <div className="new-room-request" ref={cardRef}>
            <div className="room-name">
                <input
                    value={roomName}
                    onChange={(e) => handleString(e.target.value, setRoomName)}
                    className="room-name-input"
                    placeholder="room name"
                />
            </div>
            <div className="browse-users">
                <ReactTags
                    tags={addedMember}
                    suggestions={userTag.filter(v => {return addedMember.filter(v1 => {return v1.id == v.id}).length == 0})}
                    placeholderText="add users"
                    onAddition={onAddMember}
                    onDelete={onDeleteMember}
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
