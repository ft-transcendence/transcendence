import React from 'react';
import './App.css';
import { io } from "socket.io-client";
import { createSolutionBuilderWithWatchHost, getImpliedNodeFormatForFile } from 'typescript';
import { ServerResponse } from 'http';

const socket = io("ws://localhost:4000");

interface Ball 
{
    id: number;
    roomId: string;
    status: boolean; // true = in progress
    x: number;
    y: number;
    xSpeed: number;
    ySpeed: number;
}

interface Coordinates {
  x: number,
  y: number,
  showBall: boolean,
}

interface ExtendedCoordinates {
  xstart: number,
  ystart: number,
  x: number,
  y: number,
}

interface StatePaddle {
  x: number,
  y: number,
}

interface StatePong {
  ballX: number,
  ballY: number,
  paddleLY: number,
  gameStarted: boolean,
  roomId: number,
  showStartButton: boolean,
}

interface Button {
  clickHandler: any;
  showButton: boolean;
}

interface ButtonState {
  showButton: boolean;
}

class StartButton extends React.Component< Button, ButtonState > {

  constructor(props: Button){
    super(props);
    this.state = {showButton: true};
  }

  static getDerivedStateFromProps(props: Button, state: ButtonState){
    return {
      showButton: props.showButton
    };
  }

  render() {
       const btt = this.state.showButton ? 'butt-on': 'butt-off';
    return (
             <div className={`${btt}`}>
              <button onClick={this.props.clickHandler} className="button">Start</button>
             </div>
    )
  }
  } 

class Field extends React.Component
{
  render() {
    
    return (
      <div id="field">
        <div
            style={{
               width: "1px",
               height: `${window.innerHeight}px`,
               top: "0px",
               left: `${window.innerWidth / 2}px`,
               position: "absolute",
               backgroundColor: "white"
            }}
          />
        </div>
          );
  }
}
 
class Ball extends React.Component< Coordinates, {} >
{
  render() {
    const bll = this.props.showBall ? 'ball-on': 'ball-off';
      return (
         <div
            style={{
               width: "30px",
               height: "30px",
               top: `${this.props.y}px`,
               left: `${this.props.x}px`,
               position: "absolute",
               backgroundColor: "white"
            }}
            className={`${bll}`}
         />
      );
   }
}

class Paddle extends React.Component< ExtendedCoordinates, StatePaddle > {
constructor(props: ExtendedCoordinates){
  super(props);
  this.state = {x: props.x, 
                y: props.ystart};
};

componentWillReceiveProps(props: ExtendedCoordinates) {
this.setState({y: props.y});
  }
  
  render() {
      return (
          
        <div
            style={{
               width: "15px",
               height: "100px",
               position: "absolute",
               backgroundColor: "white",
               top: `${this.state.y}px`,
               left: `${this.state.x}px`
            }}
         />
      );
   }
}

class Pong extends React.Component < {}, StatePong > {
  refresher: any;

  constructor({}) 
  {
    super({});
    this.state = {paddleLY: window.innerHeight / 2 - 50,
                  ballX: 400,
                  ballY: 300,
                  gameStarted: false,
                  showStartButton: true,
                  roomId: 0};
  }
  
  componentDidMount() 
  {
    this.refresher  = setInterval(
      () => this.refresh(),
      1
    );
  }

  componentWillUnmount()
  {
    clearInterval(this.refresher);
  }
  
  refresh()
  {
    if (this.state.gameStarted)
    {
      socket.emit("getUpdate", {rid: this.state.roomId,}, (info: Ball) =>
      this.setState({ballX: info.x, ballY:info.y}));
      socket.on("update", (info: Ball) =>
      this.setState({ballX: info.x, ballY:info.y}));
    }
  }

  startButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket.emit("start", {}, (rid: number) => 
    {if (rid >= 0) {
      this.setState({gameStarted: true, roomId: rid, showStartButton: false});  
    }
    else {
      this.setState({roomId: rid, showStartButton: false});  
    }
  }
  )
  }

  render() 
  {
    console.log("re render PONG");
    return (
      <div>
        <StartButton showButton={this.state.showStartButton} clickHandler={this.startButtonHandler} />
        <Ball showBall={this.state.gameStarted} x={this.state.ballX} y={this.state.ballY} />
      </div>
      )
  }
}

function App() {
  socket.emit("game", {}, (data: string) => {console.log(data);}); // for testing purpose, must be removed
  return (
    <Pong />
  );
}

export default App;
