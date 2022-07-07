import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { socket } from "../App";

export default function Chat() {
    
    const id = useRef(0);
    const cid = useRef(0);
    const [ msg, setNewMsg ] = useState("");
    const [ email, setNewEmail ] = useState("");
    const [ cname, setNewCname ] = useState("");
    let cprivate = "false";
    let cprivateRet = false;
    const [ cpassword, setNewCpassword ] = useState("");

    useEffect(() => {
        socket.on('connect', () => {
            console.log('front Connected');
        });

        socket.on('msg', function(data) {
            console.log('msg', data);
        });

        socket.on('broadcast', function(data) {
            console.log('broadcast', data);
        });
/////
        socket.on('msg sent:', function(data: string) {
            console.log('msg sent:', data);
        });
        socket.on('id', function(data: number) {
            id.current = data;
            console.log('id:', data);
        });
        socket.on('cid', function(data: number) {
            cid.current = data;
            console.log('cid:', data);
        });

/////
        socket.on('exception', function(data: any) {
            console.log('error:', data.error);
        });

        socket.on('leave', () => {
            console.log('Disconnected');
        });

        return () => {
            socket.off('join');
            socket.off('msg');
            socket.off('msg sent');
            socket.off('id sent');
            socket.off('cid sent');
            socket.off('exception');
            socket.off('leave');
        }
    }, []);

    const handleMsg = (event: any) => {
        setNewMsg(event.target.value);
    }

    const sendMsg = (msg: string) => {
        console.log(msg);
        socket.emit('msg', { msg: msg, userId: id.current, channelId: cid.current });
    }

    const handleSendMsg = () => {

        sendMsg(msg);
        setNewMsg("");
    }
/////////////////////////
const handleEmail = (event: any) => {
    setNewEmail(event.target.value);
}
/////////////////////////
    const handleCname = (event: any) => {
        setNewCname(event.target.value);
    }

    const HandleCprivate = (event: any) => {
        if (cprivate === 'true')
            cprivateRet = true;
        else
            cprivateRet = false;
    }

    const handleCpassword = (event: any) => {
        setNewCpassword(event.target.value);
    }
    const handleNewChannel = (event: any) => {
        socket.emit('new channel', {name: cname, private: cprivateRet, password: cpassword});
    }
    const enterChannel = (event: any) => {
        socket.emit('enter channel', {name: cname});
    }


/////////////////////////
const signup = () => {
    // console.log("data:", data);
    socket.emit('signup', {email:email, hash:email});
}

const signin = () => {
    // console.log("data:", data);
    socket.emit('signin', {email:email, hash:email});
}

/////////////////////////
    return (
        
        <>
        <div>
            <div>
                email<br/>
                <textarea
                    value={email}
                    onChange={handleEmail}
                    placeholder="email..."
                    className="msg-input-field" />
            </div>
            <button onClick={signup} className="send-msg-button">
                signup
            </button>
            <button onClick={signin} className="send-msg-button">
                signin
            </button>
        </div>
        <div>
            <div>
                channel name<br/>
                <textarea
                    value={cname}
                    onChange={handleCname}
                    placeholder="channel id"
                    className="msg-input-field" />
            </div>
            <div>
                private channel<br/>
                <div onChange={HandleCprivate}>
                    <input type="radio" value="true" name="cprivate"/> yes
                    <input type="radio" value="false" name="cprivate"/> no
                </div>
            </div>
            <div>
                channel password<br/>
                <textarea
                    value={cpassword}
                    onChange={handleCpassword}
                    placeholder="password if needed..."
                    className="msg-input-field" />
            </div>
            <button onClick={handleNewChannel} className="send-msg-button">
                create channel
            </button>
            <button onClick={enterChannel} className="send-msg-button">
                enter channel
            </button>
        </div>
        <div>
            Chat<br/>
            <textarea
                value={msg}
                onChange={handleMsg}
                placeholder="Write msg...."
                className="msg-input-field" />
            <button onClick={handleSendMsg} className="send-msg-button">
                send
            </button>
        </div>
        </>
    )
}