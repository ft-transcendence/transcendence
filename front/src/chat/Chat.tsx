import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
// import { Link, Outlet, useLocation } from "react-router-dom";
import { socket } from "../App";

export default function Chat() {
    
    const id = useRef(0);
    const [ msg, setNewMsg ] = useState("");
    const [ email, setNewEmail ] = useState("");
    const [ cid, setNewCid ] = useState(0);
    
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
        socket.on('cid sent', function(data: string) {
            console.log('cid sent ', data);
        });

/////
        socket.on('exception', function(data) {
            console.log('msg', data);
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
        socket.emit('msg', {msg: msg, userId: id.current, channelId: cid, });
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
    // const handleId = (event: any) => {
    //     setNewId(event.target.value);
    // }
/////////////////////////
    const handleCid = (event: any) => {
        // setNewCid(cid + 1);
        setNewCid(event.target.value);
    }
/////////////////////////
const signup = () => {
    // console.log("data:", data);
    socket.emit('signup', {email:email, hash:email, channel:cid});
}

const signin = () => {
    // console.log("data:", data);
    socket.emit('signin', {email:email, hash:email, channel:cid});
}

const handleSignup = () => {
    signup();
}
const handleSignin = () => {
    signin();
}   
/////////////////////////
    return (
        
        <>
        <div>
            email<br/>
            <textarea
                value={email}
                onChange={handleEmail}
                placeholder="email..."
                className="msg-input-field" />
            {/* <button onClick={handleSendEmail} className="send-msg-button">
                send
            </button> */}
        </div>
        <div>
            cid<br/>
            <textarea
                value={cid}
                onChange={handleCid}
                placeholder="channel id"
                className="msg-input-field" />
            <button onClick={handleSignup} className="send-msg-button">
                signup
            </button>
            <button onClick={handleSignin} className="send-msg-button">
                signin
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