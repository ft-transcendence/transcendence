import { io } from "socket.io-client";
import "./Game.css";
import {Particles} from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container } from "tsparticles-engine";
import { Link, Outlet, useLocation } from "react-router-dom";

const socket = io("ws://localhost:4000");



export default function Game() {


    const particlesInit = async (main: any) => {
        console.log(main);
        await loadFull(main);
    };

    const particlesLoaded = async (container?: Container | undefined) => {
        console.log(container);
    };

    return (
        <div className='Radial-background'>
            <Particles id="tsparticles" url="particlesjs-config.json" init={particlesInit} loaded={particlesLoaded} />

            <div className='Page-top'>

            </div>
            <div className='Page-mid'>
                <div className='Field'>
               
                  
                        <div className='Pad-left'></div>
                 
                    <div className='Center-zone'>
                        <div className='Middle-line'>

                        </div>
                        <div className='Center-circle'>

                        </div>
                        <div className='Middle-line'>

                        </div>
                    </div>
                  
                    <div className='Pad-right'></div>
                 
                   
                
                    <div className='Ball'>
                    </div>
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
                <div className='bar'>
                </div>
                <div className='innerFoot'>
                    <Link to="/" className='Button'>
                        home
                    </Link>
                    <Link to="/leaderboard" className='Button'>
                        leaderboard
                    </Link>
                    <div className='Button'>
                        chat
                    </div>
                    <div className='Button'>
                        setting
                    </div>
                </div>
            </div>
        </div>
    )
}