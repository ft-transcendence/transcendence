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
            <div className='Game-board'>
                <div className='ball'>

                </div>
                <div className='Info-card'>
                    <div className='Player-left'>
                        <div className='Info-left'>
                            <div className='photo'>
                            
                            </div>
                            <div className='name'>
                            
                            </div>
                        </div>
                        <div className='Score'>
                        
                        </div>
                    </div>
                    <div className='Player-right'>
                        <div className='Score'>
                        
                        </div>
                        <div className='Info-right'>
                            <div className='name'>
                            
                            </div>
                            <div className='photo'>
                            
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Field'>
                    <div className='Pad'>
                    <style>pedding-left: 30px;</style>
                    </div>
                    <div className='Center-line'>

                    </div>
                    <div className='Center-circle'>

                    </div>
                    <div className='Pad'>

                    </div>
                </div>
            </div>
            <div className='buttons'>

            </div>
            
        </div>
    )
}