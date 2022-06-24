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
            <div className='Page-top'>

            </div>
            <div className='Page-mid'>
                <div className='Field'>
                    <div className='Friend-zone'>
                    </div>
                    <div className='Pad-zone'>
                        <div className='Pad'></div>
                    </div>
                    <div className='Center-zone'>
                        <div className='Middle-line'>

                        </div>
                        <div className='Center-circle'>

                        </div>
                        <div className='Middle-line'>

                        </div>
                    </div>
                    <div className='Pad-zone'>
                    <div className='Pad'></div>
                    </div>
                    <div className='Friend-zone'>
                    </div>
                </div>
                <div className='Ball'>
                    
                </div>
                <div className='Info-card'>
                    <div className='Player-left'>
                        <div className='Info'>
                            <div className='Photo'>
                            
                            </div>
                            <div className='Login' style={{textAlign: 'left'}}>
                            shlu
                            </div>
                        </div>
                        <div className='Score'>
                        4
                        </div>
                    </div>
                    <div className='Player-right'>
                        <div className='Score'>
                            3
                        </div>
                        <div className='Info'>
                            
                            <div className='Login' style={{textAlign: 'right'}}>
                            lrgergfde
                            </div>
                            <div className='Photo'>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='Page-foot'>
                <div className='Button'>
                    game
                </div>
                <div className='Button'>
                    ranking
                </div>
                <div className='Button'>
                    chat
                </div>
                <div className='Button'>
                    setting
                </div>
            </div>
        </div>
    )
}