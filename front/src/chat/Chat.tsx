import React, { useEffect, useState } from "react";
import "./Chat.css";
import { io } from 'socket.io-client';
// import { Link, Outlet, useLocation } from "react-router-dom";
import { socket } from "../App";

export default function Chat() {
    
    const [ msg, setNewMsg ] = React.useState("");
    // const [ id, setNewId ] = React.useState("");
    // const [ password, setNewPass ] = React.useState("");
    
    useEffect(() => {
        socket.on('connect', () => {
            console.log('front Connected');

            socket.emit('test', {userId: 1, channelId:1, msg: 'a test' });
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
        // socket.on('id sent', function(data: string) {
        //     console.log('id sent ', data);
        // });
        // socket.on('pass sent', function(data: string) {
        //     console.log('pass sent ', data);
        // });

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
            // socket.off('id sent');
            // socket.off('pass sent');
            socket.off('exception');
            socket.off('leave');
        }

    }, []);

    const handleMsg = (event: any) => {
        setNewMsg(event.target.value);
    }

    const sendMsg = (msg: string) => {
        console.log(msg);
        socket.emit('msg', {userId: 1, channelId:1, msg: msg});
    }

    const handleSendMsg = () => {

        sendMsg(msg);
        setNewMsg("");
    }
/////////////////////////

    // const handleId = (event: any) => {
    //     setNewId(event.target.value);
    // }

    // const sendId = (id: string) => {
    //     console.log(id);
    //     socket.emit('id', id);
    // }

    // const handleSendId = () => {

    //     sendId(id);
    //     setNewId("");
    // }

    
/////////////////////////
    // const handlePass = (event: any) => {
    //     setNewPass(event.target.value);
    // }

    // const sendPass = (pass: string) => {
    //     console.log(pass);
    //     socket.emit('pass', pass);
    // }

    // const handleSendPass = () => {

    //     sendPass(password);
    //     setNewPass("");
    // }

    return (
        
        <>
        {/* <div>
            login<br/>
            <textarea
                value={id}
                onChange={handleId}
                placeholder="channel"
                className="msg-input-field" />
            <button onClick={handleSendId} className="send-msg-button">
                send
            </button>
        </div>
        <div>
            password<br/>
            <textarea
                value={password}
                onChange={handlePass}
                placeholder="password"
                className="msg-input-field" />
            <button onClick={handleSendPass} className="send-msg-button">
                send
            </button>
        </div> */}
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