import React from 'react';
import logo from './logo.svg';
import { io } from "socket.io-client";
import { getImpliedNodeFormatForFile } from 'typescript';
import { ServerResponse } from 'http';
import "./Game.css";

const socket = io("ws://localhost:4000");

export default function Game() {
    return (
        <div className='Radial-background'>
              
            <div className='Game-board'>

            </div>
            <div className='buttons'>

            </div>
            
        </div>
    )
}