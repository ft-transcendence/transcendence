import React, { useEffect } from "react";
import "./Chat.css";
import { io } from 'socket.io-client';
import { Link, Outlet, useLocation } from "react-router-dom";
import { createSocket } from "dgram";

const socket = io('http://localhost:3000');

export default function Chat() {
    
    socket.emit('msg', {name: 'Nest' }, (data: string) => console.log(data));
    // socket.on('msg', (data: string) => console.log(data));
    
    useEffect(() => {
        socket.on('connect', function() {
            console.log('Connected');

            socket.emit('msg', {test: 'test'});
        });

        socket.on('msg', function(data) {
            console.log('msg', data);
        });

        socket.on('exception', function(data) {
            console.log('msg', data);
        });

        socket.on('disconnect', function(data) {
            console.log('Disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('msg');
            socket.off('exception');
            socket.off('disconnect');
        }

    }, []);

    

    return (
        <div>
            this is chat hehehe
        </div>
    )
}