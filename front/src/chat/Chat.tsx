import React, { useEffect, useState } from "react";
import "./Chat.css";
import { io } from 'socket.io-client';
import { Link, Outlet, useLocation } from "react-router-dom";


const socket = io('http://localhost:4000/chat');

export default function Chat() {
    
    const [ msg, setNewMsg ] = React.useState("");

    // socket.emit('msg', {name: 'Nest' }, (data: string) => console.log(data));
    // socket.on('msg', (data: string) => console.log(data));
    
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected');

            socket.emit('msg', {test: 'test'});
        });

        socket.on('msg', function(data) {
            console.log('msg', data);
        });

        socket.on('exception', function(data) {
            console.log('msg', data);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('msg');
            socket.off('exception');
            socket.off('disconnect');
        }

    }, []);

    const handleMsgInput = (event: any) => {
        setNewMsg(event.target.value);
    }

    const sendMsg = (msg: string) => {
        socket.emit('msg', msg);
    }

    const handleSendMsg = () => {

        sendMsg(msg);
        setNewMsg("");
    }

    return (
        <div>
            this is chat hehehe
            <textarea
                value={msg}
                onChange={handleMsgInput}
                placeholder="Write msg...."
                className="msg-input-field"
            />
            <button onClick={handleSendMsg} className="send-msg-button">
                send
            </button>
        </div>
    )
}