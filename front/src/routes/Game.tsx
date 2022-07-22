import React from "react";
import { io } from "socket.io-client";
import "./Game.css";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container } from "tsparticles-engine";
import { Link } from "react-router-dom";
import {
  Game_data,
  Player,
  Coordinates,
  StatePong,
  Button,
  ButtonState,
  Msg,
  MsgState,
  PaddleProps,
  StatePaddle,
} from "./game.interfaces";

const socketOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
            Token: localStorage.getItem("userToken"),
        }
      }
    }
 };
 

const socket = io("ws://localhost:4000", socketOptions);

const MOVE_UP = "ArrowUp";
const MOVE_DOWN = "ArrowDown";

class StartButton extends React.Component<Button, ButtonState> {
  constructor(props: Button) {
    super(props);
    this.state = { showButton: true };
  }

  static getDerivedStateFromProps(props: Button, state: ButtonState) {
    return {
      showButton: props.showButton,
    };
  }

  render() {
    const btt = this.state.showButton ? "unset" : "none";
    return (
      <button
        onClick={this.props.clickHandler}
        style={{ display: `${btt}` }}
        className="Start_button"
      >
        Start
      </button>
    );
  }
}

class Ball extends React.Component<Coordinates, {}> {
  render() {
    const show = this.props.showBall ? "unset" : "none";
    return (
      <div
        style={{
          top: `calc(${this.props.y}% - 1vh)`,
          left: `calc(${this.props.x}% - 1vh)`,
          display: `${show}`,
        }}
        className={"Ball"}
      />
    );
  }
}

    constructor(props: Msg){
        super(props);
        this.state = {showMsg: false,
                      type: 0};
        }
      
        static getDerivedStateFromProps(props: Msg, state: MsgState){
          return {
            showMsg: props.showMsg,
            type: props.type
          };
        }
      
        render() {
             const disp = this.state.showMsg ? 'unset': 'none';
             var message: string;
             switch(this.state.type) {
                case 1:
                    message = "Please wait for another player";
                    break;
                case 2:
                    message = "You win :)";
                    break;
                case 3:
                    message = "You lose :(";
                    break;
                default:
                    message = "error";
             }
          return (
                <div style={{display: `${disp}`,}} className="Message">{message}</div>
            )
        }
        } 

  static getDerivedStateFromProps(props: Msg, state: MsgState) {
    return {
      showMsg: props.showMsg,
      type: props.type,
    };
  }

    componentWillReceiveProps(props: PaddleProps) {
    this.setState({y: props.y});
      }
      
    render() {
        const show = this.props.show ? 'unset': 'none';
        var side: string;
        if (this.props.side === 'left')
            side = "Pad-left";
        else
            side = "Pad-right";
        return (
            <div
              style={{
                display: `${show}`,
                top: `${this.state.y}%`,
              }} 
              className={`${side}`}
           />
        );
       }
    }
    return (
      <div style={{ display: `${disp}` }} className="Message">
        {message}
      </div>
    );
  }
}

class Paddle extends React.Component<PaddleProps, StatePaddle> {
  constructor(props: PaddleProps) {
    super(props);
    this.state = { side: props.side, y: props.ystart, show: props.show };
  }

  componentWillReceiveProps(props: PaddleProps) {
    this.setState({ y: props.y });
  }

  render() {
    const show = this.props.show ? "unset" : "none";
    var side: string;
    if (this.props.side === "left") side = "Pad-left";
    else side = "Pad-right";
    return (
      <div
        style={{
          display: `${show}`,
          top: `${this.state.y}%`,
        }}
        className={`${side}`}
      />
    );
  }
}

    constructor(none = {}) 
    {
        super({});
        this.state = {  paddleLeftY: 50,
                        paddleRightY: 50,
                        ballX: 50,
                        ballY: 50,
                        gameStarted: false,
                        showStartButton: true,
                        roomId: 0,
                        playerNumber: 0,
                        player1Score: 0,
                        player2Score: 0,
                        msgType: 0,
                    };
    }

    componentDidMount() {
        document.onkeydown = this.keyDownInput;
        document.onkeyup = this.keyUpInput;
        socket.on("game_started", () =>
            this.setState({gameStarted: true}));
        socket.on("update", (info: Game_data) =>
            this.setState({ballX: info.xBall, ballY: info.yBall, paddleLeftY: info.paddleLeft, paddleRightY: info.paddleRight, player1Score: info.player1Score, player2Score: info.player2Score}));
        socket.on("end_game", (winner: number) => 
            winner === this.state.playerNumber ? this.setState({msgType: 2, gameStarted: false}) : this.setState({msgType: 3, gameStarted: false}));
    }

  particlesInit = async (main: any) => {
    console.log(main);
    await loadFull(main);
  };

  particlesLoaded = async (container?: Container | undefined) => {
    console.log(container);
  };

    startButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        socket.emit("start", {}, (player: Player) => 
          this.setState({roomId: player.roomId, playerNumber: player.playerNb, showStartButton: false, msgType: 1}));  
        }
     
   
    keyDownInput = (e: KeyboardEvent) => {
    if (e.key === MOVE_UP && this.state.gameStarted)
        socket.emit("move", {dir: 1, room: this.state.roomId, player: this.state.playerNumber});
    if (e.key === MOVE_DOWN)
        socket.emit("move", {dir: 2, room: this.state.roomId, player: this.state.playerNumber});
    }
    
    keyUpInput = (e: KeyboardEvent) => {
        if ((e.key === MOVE_UP || e.key === MOVE_DOWN) && this.state.gameStarted)
            socket.emit("move", {dir: 0, room: this.state.roomId, player: this.state.playerNumber});
    }

    render() {
    const shoWField = this.state.gameStarted ? 'unset': 'none';
    const shoWInfo = this.state.gameStarted ? 'flex': 'none';
    const showBorder = this.state.gameStarted ? '2px solid rgb(0, 255, 255)' : '0px solid rgb(0, 255, 255)';
    const showShadow = this.state.gameStarted ? '0px 0px 5px 5px rgb(80, 200, 255), inset 0px 0px 5px 5px rgb(0, 190, 255)' : '0';
    var leftName;
    var rightName;
    if (this.state.playerNumber === 1)
    {    
        leftName = "you";
        rightName = "opponent";
    }
    else
    {    
        rightName = "you";
        leftName = "opponent";
    }
    return (
      <div className="Radial-background">
        <Particles
          id="tsparticles"
          url="particlesjs-config.json"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
        />

            <div className='Page-top'>
            <div style={{display: `${shoWInfo}`,}} className='Info-card'>
                    <div className='Player-left'>
                        <div className='Info'>
                            <div className='Photo'>
                            
                            </div>
                            <div className='Login' style={{textAlign: 'left'}}>
                            {leftName}
                            </div>
                        </div>
                        <div className='Score'>
                        {this.state.player1Score}
                        </div>
                    </div>
                    <div className='Player-right'>
                        <div className='Score'>
                        {this.state.player2Score}
                        </div>
                        <div className='Info'>
                            
                            <div className='Login' style={{textAlign: 'right'}}>
                            {rightName}
                            </div>
                            <div className='Photo'>
                            
                            </div>
                        </div>
                    </div>
                </div>
              </div>
              <div className="Score">{this.state.player1Score}</div>
            </div>
            <div className="Player-right">
              <div className="Score">{this.state.player2Score}</div>
              <div className="Info">
                <div className="Login" style={{ textAlign: "right" }}>
                  {rightName}
                </div>
                <div className="Photo"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="Page-mid">
          <div
            style={{ border: `${showBorder}`, boxShadow: `${showShadow}` }}
            className="Field"
          >
            <Paddle
              show={this.state.gameStarted}
              side={"left"}
              y={this.state.paddleLeftY}
              ystart={this.state.paddleLeftY}
            />
            <Paddle
              show={this.state.gameStarted}
              side={"right"}
              y={this.state.paddleRightY}
              ystart={this.state.paddleRightY}
            />

            <div className="Center-zone">
              <StartButton
                showButton={this.state.showStartButton}
                clickHandler={this.startButtonHandler}
              />
              <Message
                showMsg={!this.state.showStartButton && !this.state.gameStarted}
                type={this.state.msgType}
              />

              <div
                style={{ display: `${shoWField}` }}
                className="Middle-line-top"
              ></div>
              <div
                style={{ display: `${shoWField}` }}
                className="Center-circle"
              ></div>
              <div
                style={{ display: `${shoWField}` }}
                className="Middle-line-bottom"
              ></div>
            </div>

            <div className="Pad-right"></div>

            <Ball
              showBall={this.state.gameStarted}
              x={this.state.ballX}
              y={this.state.ballY}
            />
          </div>
        </div>
        <div className="Page-foot">
          <div className="bar"></div>
          <div className="innerFoot">
            <Link to="/" className="Button">
              home
            </Link>
            <Link to="/leaderboard" className="Button">
              leaderboard
            </Link>
            <div className="Button">chat</div>
            <div className="Button">setting</div>
          </div>
        </div>
      </div>
    );
  }
}
