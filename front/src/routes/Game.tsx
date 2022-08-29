import React from 'react';
import { io } from "socket.io-client";
import "./Game.css";
import { Game_data, Player, Coordinates, StatePong, Button, ButtonState, Msg, MsgState, PaddleProps, StatePaddle, SettingsProps, SettingsState } from './game.interfaces';
import FocusTrap from 'focus-trap-react';
import { getUserAvatarQuery } from '../queries/avatarQueries';
import SoloGame from './SoloGame';

 

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
        onKeyDown={(event) => {this.props.onKeyDown(event)}}
      >
        <div className="modal-text">
          Press key for moving {this.state.message}
        </div>
        <button onClick={() => {this.props.onClickClose()}} className="closeButton">X</button>
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
                      type: 0,};
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

    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
              Token: localStorage.getItem("userToken"),
          }
        }
      },
      path: '/api/pong/',
   };
  
  const socketURL = '/gamespace';
  
  const socket = io(socketURL, socketOptions);

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("error", (err) => {
    console.log(`error due to ${err.message}`);
  });
export default class Game extends React.Component < {}, StatePong > {

    MOVE_UP   = "ArrowUp";  
    MOVE_DOWN = "ArrowDown";
    avatarsFetched = false;

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
                        avatarP1URL: "",
                        avatarP2URL: "",
                        soloGame: false,
                    };
        this.onSettingsKeyDown = this.onSettingsKeyDown.bind(this);
        this.onSettingsClickClose = this.onSettingsClickClose.bind(this);
        this.quitSoloMode = this.quitSoloMode.bind(this);
    }

    componentDidMount() {
        document.onkeydown = this.keyDownInput;
        document.onkeyup = this.keyUpInput;
        socket.on("game_started", () => {
            this.setState({gameStarted: true, showStartButton: false});
            this.avatarsFetched = false;
        });
        socket.on("update", (info: Game_data) => {
            this.setState({ballX: info.xBall, ballY: info.yBall, paddleLeftY: info.paddleLeft, paddleRightY: info.paddleRight, player1Score: info.player1Score, player2Score: info.player2Score, player1Name: info.player1Name, player2Name: info.player2Name});
            if (this.avatarsFetched === false) {
              this.avatarsFetched = true;
              this.getAvatars(info.player1Avatar, info.player2Avater);
            }
        });
        socket.on("end_game", (winner: number) => 
            winner === this.state.playerNumber ? this.setState({msgType: 2, gameStarted: false, showStartButton: true, buttonState: "New Game", avatarP1URL: "", avatarP2URL: ""}) : this.setState({msgType: 3, gameStarted: false, showStartButton: true, buttonState: "New Game", avatarP1URL: "", avatarP2URL: ""}));
    }

    componentWillUnmount() {
      socket.off("game_started");
      socket.off("update");
      socket.off("end_game");
    }

    startButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!this.state.showStartButton)
            return;
        if (this.state.buttonState === "Cancel") {
          socket.disconnect();
          socket.connect();
          this.setState({gameStarted: false, showStartButton: true, buttonState: "Start"});
          return;
        }
        this.setState({buttonState: "Cancel"});
        socket.emit("start", {}, (player: Player) => 
          this.setState({roomId: player.roomId, playerNumber: player.playerNb, msgType: 1}));  
        }
    
    soloButtonHandler = () =>
        this.setState({soloGame: true});
   
    keyDownInput = (e: KeyboardEvent) => {
      if (e.key === this.MOVE_UP && this.state.gameStarted) {
        e.preventDefault();  
        socket.emit("move", {dir: 1, room: this.state.roomId, player: this.state.playerNumber});
      }

      if (e.key === this.MOVE_DOWN) {
        e.preventDefault();  
        socket.emit("move", {dir: 2, room: this.state.roomId, player: this.state.playerNumber});
      }
    }
    
    keyUpInput = (e: KeyboardEvent) => {
        if ((e.key === this.MOVE_UP || e.key === this.MOVE_DOWN) && this.state.gameStarted) {
          e.preventDefault();
          socket.emit("move", {dir: 0, room: this.state.roomId, player: this.state.playerNumber});
        }
    }

    onSettingsKeyDown = (e: KeyboardEvent) => {
      if (this.state.settingsState === "up") {
        this.setState({settingsState: "down"});
        this.MOVE_UP = e.key;
      }
      else if (this.state.settingsState! === "down") {
        this.setState({isSettingsShown: false, settingsState: "up"});
        this.MOVE_DOWN = e.key
      }
    };

    onSettingsClickClose() {
      this.setState({isSettingsShown: false, settingsState: "up"});
    };

    showSettings() {
      this.setState({isSettingsShown: true});
    }

    getAvatars = async (id1: number, id2: number) => {
      const result_1: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(id1);
      const result_2: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(id2);
      if (result_1 !== undefined && result_1 instanceof Blob) {
        this.setState({ avatarP1URL: URL.createObjectURL(result_1) });
      if (result_2 !== undefined && result_2 instanceof Blob) {
        this.setState({ avatarP2URL: URL.createObjectURL(result_2) });
      }
    }; }
    
    quitSoloMode() {
      this.setState({soloGame: false});
    }

    render() {
    const shoWInfo = this.state.gameStarted ? 'flex': 'none';
    /*const showBorder = this.state.gameStarted ? '2px solid rgb(0, 255, 255)' : '0px solid rgb(0, 255, 255)';*/
    const showBorder = this.state.gameStarted ? '2px solid rgb(255, 255, 255)' : '0px solid rgb(255, 255, 255)';
    /*const showShadow = this.state.gameStarted ? '0px 0px 5px 5px rgb(80, 200, 255), inset 0px 0px 5px 5px rgb(0, 190, 255)' : '0';*/
    const showShadow = '0';

    var leftName = String(this.state.player1Name);
    var rightName = String(this.state.player2Name);

    return (
      <div>
      {this.state.soloGame ? (
        <SoloGame clickHandler={this.quitSoloMode}></SoloGame>) : (
        <div className='Radial-background'>
            <div className='Page-top'>
            <div style={{display: `${shoWInfo}`,}} className='Info-card'>
                    <div className='Player-left'>
                        <div className='Info'>
                        {this.state.avatarP1URL ? (
                            <div className='Photo' style={{
                                backgroundImage: `url("${this.state.avatarP1URL}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}></div> ) : (
                              <div className='Photo'></div>)}
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
                            {this.state.avatarP2URL ? (
                            <div className='Photo' style={{
                                backgroundImage: `url("${this.state.avatarP2URL}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}></div> ) : (
                              <div className='Photo'></div>)}    
                        </div>
                    </div>
                </div>
            </div>
            <div className='Page-mid'>
             
                <div style={{   border: `${showBorder}`, 
                                boxShadow: `${showShadow}`,}} className='Field'>
               
                  
                    <Paddle show={this.state.gameStarted} side={"left"} y={this.state.paddleLeftY} ystart={this.state.paddleLeftY} />
                    <Paddle show={this.state.gameStarted} side={"right"} y={this.state.paddleRightY} ystart={this.state.paddleRightY} />

                  
                    <div className='Center-zone' style={{display: `${shoWInfo}`,}}>    
                        <div className='Middle-line-top'></div>
                        <div className='Center-circle'></div>
                        <div className='Middle-line-bottom'></div>
                    </div>
                    
                    <div className='Pad-right'></div>
                 
                                  
                    <Ball showBall={this.state.gameStarted} x={this.state.ballX} y={this.state.ballY} />
                    
                </div>
         
            </div>

            <div className='Button-msg-zone'>
                    <Message showMsg={this.state.buttonState !== "Start" && !this.state.gameStarted} type={this.state.msgType} />
                    <StartButton showButton={this.state.showStartButton} clickHandler={this.startButtonHandler} buttonText={this.state.buttonState} />
                    <StartButton showButton={this.state.showStartButton} clickHandler={this.soloButtonHandler} buttonText="Solo mode" />
            </div>
            <div>
                {this.state.isSettingsShown ? (
            <Settings
              message={this.state.settingsState!}
              onKeyDown={this.onSettingsKeyDown}
              onClickClose={this.onSettingsClickClose}
            />
          ) : null}
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
    </div>)}
}