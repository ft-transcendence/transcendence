import React from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";
import { getImpliedNodeFormatForFile } from 'typescript';
import { ServerResponse } from 'http';
import Game from './Game';

const socket = io("ws://localhost:4000");


function App() {
  socket.emit("game", {}, (data: string) => {console.log(data);}); // for testing purpose, must be removed
  return (
    <div className="App">
     
    </div>
  );
}

export default App;
