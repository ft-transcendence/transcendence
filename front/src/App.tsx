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
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Hamburger numberOfHamburgers={5}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Reacto
        </a>
      </header> */}
      <a>
        <Game />
      </a>
    </div>
  );
}

export default App;
