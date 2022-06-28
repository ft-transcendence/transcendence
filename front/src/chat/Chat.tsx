import { io } from 'socket.io-client';
import "./Chat.css";
import { Link, Outlet, useLocation } from "react-router-dom";

const socket = io("ws:")

export default function Chat() {

    socket.emit('chat', {name: 'Nest' }, (data: string) => console.log(data));
    socket.on('chat', (data: string) => console.log(data));
    return (
        <div>
            this is chat hehehe
        </div>
    )
}