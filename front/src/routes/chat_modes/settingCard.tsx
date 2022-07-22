import "./newRoomCard.css";
import "./tags.css"
import { useEffect, useState } from "react";
import { socket } from "../../App";
import { newChannel, updateChannel } from "./type/chat.type";
import "react-contexify/dist/ReactContexify.css";
import "./context.css";
import Switch from "react-switch";
import { useAuth } from "../..";

export function SettingCard({settingRequest, onSettingRequest}
    : { settingRequest: boolean,
        onSettingRequest: () => void}) {
    const email = useAuth().user;
    const [roomName, setRoomName] = useState("");
    const [roomPass, setRoomPass] = useState("");
    const [isPrivate, setPrivate] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    useEffect(() => {
        console.log("settingCard : request:", settingRequest)

        if (settingRequest === false)
        {   
            initVars();
            console.log("settingCard : request:", settingRequest)
        }

        return  (() => {
            
        })
        // @ts-ignore-next-line
    }, [settingRequest])

    const handleString = (value: string, setValue: (value: string) => void) => {
        setValue(value);
    }

    const handlePrivate = () => {
        setPrivate(old => {return !old});
    }

    const handleIsPassword = () => {
        setIsPassword(old => {return !old});
    }

    const onUpdate = () => {
        let data: updateChannel = {
            channelId: undefined,
            email: null,
            password: "",
            adminEmail: "",
            invitedId: ""
        }
        socket.emit("update channel", data);
        initVars();
        onSettingRequest();
    }

    const initVars = () => {
        setRoomName("");
        setPrivate(false);
        setIsPassword(false);
        setRoomPass("");
    }

    return (
        <div className="card">
            <div className="room-name">
                <input
                    value={roomName}
                    onChange={(e) => handleString(e.target.value, setRoomName)}
                    className="room-name-input"
                    placeholder="room name"
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
                onMouseUp={onUpdate}
                className="create-room-button">
                    update setting
            </div>
        </div>
    )
}
