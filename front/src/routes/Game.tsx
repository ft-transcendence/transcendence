import React from 'react';
import { io } from "socket.io-client";
import "./Game.css";
import { Link } from "react-router-dom";
import { Game_data, Player, Coordinates, StatePong, Button, ButtonState, Msg, MsgState, PaddleProps, StatePaddle, SettingsProps, SettingsState } from './game.interfaces';
import { Form } from 'react-bootstrap';
import { FocusTrap } from 'focus-trap-react';
 

class Settings extends React.Component <SettingsProps, SettingsState> {
  
  constructor(props: SettingsProps){
    super(props);
    this.state = {message: this.props.message};
  }

  static getDerivedStateFromProps(props: SettingsProps, state: SettingsState){
    return {message: props.message};
  }

    render() {
      return (
        <FocusTrap>
      <aside
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        className="modal-settings"
        onClick={() => this.props.onClickOutside}
        onKeyDown={() => this.props.onKeyDown}
      >
        <div className="modal-text">
          {this.state.message}
        </div>
      </aside>
    </FocusTrap>
      );

    }
  }


class StartButton extends React.Component< Button, ButtonState > {

    constructor(props: Button){
      super(props);
      this.state = {showButton: true,
                    buttonText: "Start",
      };
    }
  
    static getDerivedStateFromProps(props: Button, state: ButtonState){
      return {
        showButton: props.showButton,
        buttonText: props.buttonText
      };
    }
  
    render() {
         const btt = this.state.showButton ? 'unset': 'none';
      return (
            <button onClick={this.props.clickHandler} style={{display: `${btt}`,}} className="Start_button">{this.state.buttonText}</button>
        )
    }
    } 


class Ball extends React.Component< Coordinates, {} >
{
  render() {
    const show = this.props.showBall ? 'unset': 'none';
      return (
         <div
            style={{
               top: `calc(${this.props.y}% - 1vh)`,
               left: `calc(${this.props.x}% - 1vh)`,
               display: `${show}`

            }}
            className={ 'Ball' }
         />
      );
   }
}

class Message extends React.Component< Msg, MsgState > {

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
                    message = "You win";
                    break;
                case 3:
                    message = "You lose";
                    break;
                default:
                    message = "error";
             }
          return (
                <div style={{display: `${disp}`,}} className="Message">{message}</div>
            )
        }
        } 

class Paddle extends React.Component< PaddleProps, StatePaddle > {
    constructor(props: PaddleProps){
      super(props);
      this.state = {side: props.side, 
                    y: props.ystart,
                    show: props.show,
                };
    };

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



export default class Game extends React.Component < {}, StatePong > {

    socketOptions = {
        transportOptions: {
          polling: {
            extraHeaders: {
                Token: localStorage.getItem("userToken"),
            }
          }
        }
     };
     
    
    socket = io("ws://localhost:4000", this.socketOptions);

    MOVE_UP   = "ArrowUp";  
    MOVE_DOWN = "ArrowDown"; 

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
                        player1Name: "player1",
                        player2Name: "player2",
                        game_list: [],
                        isSettingsShown: false,
                        settingsState: "up",
                        buttonState: "Start",
                    };
    }

    componentDidMount() {
        document.onkeydown = this.keyDownInput;
        document.onkeyup = this.keyUpInput;
        this.socket.on("game_started", () =>
            this.setState({gameStarted: true, showStartButton: false}));
        this.socket.on("update", (info: Game_data) =>
            this.setState({ballX: info.xBall, ballY: info.yBall, paddleLeftY: info.paddleLeft, paddleRightY: info.paddleRight, player1Score: info.player1Score, player2Score: info.player2Score, player1Name: info.player1Name, player2Name: info.player2Name}));
        this.socket.on("end_game", (winner: number) => 
            winner === this.state.playerNumber ? this.setState({msgType: 2, gameStarted: false, showStartButton: true, buttonState: "New Game"}) : this.setState({msgType: 3, gameStarted: false, showStartButton: true, buttonState: "New Game"}));
    }

    startButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!this.state.showStartButton)
            return;
        if (this.state.buttonState === "Cancel") {
          this.socket.disconnect();
          this.socket.connect();
          this.setState({gameStarted: false, showStartButton: true, buttonState: "Start"});
          return;
        }
        this.setState({buttonState: "Cancel"});
        this.socket.emit("start", {}, (player: Player) => 
          this.setState({roomId: player.roomId, playerNumber: player.playerNb, msgType: 1}));  
        }
     
   
    keyDownInput = (e: KeyboardEvent) => {
    if (e.key === this.MOVE_UP && this.state.gameStarted)
        this.socket.emit("move", {dir: 1, room: this.state.roomId, player: this.state.playerNumber});
    if (e.key === this.MOVE_DOWN)
        this.socket.emit("move", {dir: 2, room: this.state.roomId, player: this.state.playerNumber});
    }
    
    keyUpInput = (e: KeyboardEvent) => {
        if ((e.key === this.MOVE_UP || e.key === this.MOVE_DOWN) && this.state.gameStarted)
            this.socket.emit("move", {dir: 0, room: this.state.roomId, player: this.state.playerNumber});
    }

    onSettingsKeyDown() {};

    onSettingsClickOutside() {
      this.setState({isSettingsShown: false, settingsState: "up"});
    };

    showSettings() {
      this.setState({isSettingsShown: true});
    }

    render() {
    const shoWField = this.state.gameStarted ? 'unset': 'none';
    const shoWInfo = this.state.gameStarted ? 'flex': 'none';
    /*const showBorder = this.state.gameStarted ? '2px solid rgb(0, 255, 255)' : '0px solid rgb(0, 255, 255)';*/
    const showBorder = this.state.gameStarted ? '2px solid rgb(255, 255, 255)' : '0px solid rgb(255, 255, 255)';
    /*const showShadow = this.state.gameStarted ? '0px 0px 5px 5px rgb(80, 200, 255), inset 0px 0px 5px 5px rgb(0, 190, 255)' : '0';*/
    const showShadow = '0';

    var leftName = String(this.state.player1Name);
    var rightName = String(this.state.player2Name);

    return (
        <div className='Radial-background'>
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
            <div className='Page-mid'>

            {this.state.isSettingsShown ? (
            <Settings
              message={this.state.settingsState!}
              onKeyDown={this.onSettingsKeyDown}
              onClickOutside={this.onSettingsClickOutside}
            />
          ) : null}             
                <div style={{   border: `${showBorder}`, 
                                boxShadow: `${showShadow}`,}} className='Field'>
               
                  
                    <Paddle show={this.state.gameStarted} side={"left"} y={this.state.paddleLeftY} ystart={this.state.paddleLeftY} />
                    <Paddle show={this.state.gameStarted} side={"right"} y={this.state.paddleRightY} ystart={this.state.paddleRightY} />

                    <div className='Center-zone'>
                    <StartButton showButton={this.state.showStartButton} clickHandler={this.startButtonHandler} />
                    <Message showMsg={!this.state.showStartButton && !this.state.gameStarted} type={this.state.msgType} />

                
                        
                        <div style={{display: `${shoWField}`,}} className='Middle-line-top'>

                        </div>
                        <div style={{display: `${shoWField}`,}} className='Center-circle'>

                        </div>
                        <div style={{display: `${shoWField}`,}} className='Middle-line-bottom'>

                        </div>
                    </div>
                  
                    <div className='Pad-right'></div>
                 
                   
                
                    <Ball showBall={this.state.gameStarted} x={this.state.ballX} y={this.state.ballY} />
                    
                </div>
         
            </div>
            <div className='Page-foot'>
                <div className='bar'>
                </div>
                <div className='innerFoot'>
                    <div className='Button' onClick={() => this.showSettings()}>
                        Settings
                    </div>
                </div>
            </div>
        </div>
    )}
}