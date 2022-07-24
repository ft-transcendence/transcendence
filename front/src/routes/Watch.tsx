import React, { MouseEventHandler } from 'react';
import { io } from "socket.io-client";
import "./Game.css";
import "./Watch.css";
import { Link } from "react-router-dom";
import { Game_data, Player, Coordinates, StatePong, Button, ButtonState, Msg, MsgState, PaddleProps, StatePaddle } from './game.interfaces';

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


class RefreshButton extends React.Component< Button, ButtonState > {

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
         const btt = this.state.showButton ? 'unset': 'none';
      return (
            <button onClick={this.props.clickHandler} style={{display: `${btt}`,}} className="Refresh_button">Refresh</button>
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



export default class Watch extends React.Component < {}, StatePong > {

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
                    };
    }

    componentDidMount() {
        var t = this;
        fetch("http://localhost:4000/watch", {
            method: "GET",
            headers: authFileHeader(),
            body: null,
            redirect: "follow",
          })
        .then((response) => {
            if (response.ok) {
                response.json()
                .then((data: Game_data[]) => this.setState({game_list: data})); 
            };
        })
        socket.on("update", (info: Game_data) =>
            this.setState({ballX: info.xBall, ballY: info.yBall, paddleLeftY: info.paddleLeft, paddleRightY: info.paddleRight, player1Score: info.player1Score, player2Score: info.player2Score, player1Name: info.player1Name, player2Name: info.player2Name}));
        socket.on("end_game", (winner: number) => 
            this.setState({gameStarted: false}));
    }

    refreshButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.refreshGameList();
    }
    
    refreshGameList() {
        this.state.game_list.length = 0;
        fetch("http://localhost:4000/watch", {
            method: "GET",
            headers: authFileHeader(),
            body: null,
            redirect: "follow",
          })
        .then((response) => {
            if (response.ok) {
                response.json()
                .then((data: Game_data[]) => this.setState({game_list: data})); 
            };
        })
        }
    
    
    joinGame(roomId: number): ((e: React.MouseEvent<HTMLElement>) => void) {
        return(e) => {
        if (this.state.gameStarted)
            socket.emit("unjoin", {roomId: roomId}, () => {});

        socket.emit("join", {roomId: roomId}, (ok: boolean) => {
            if (ok) {
                this.setState({gameStarted: true, roomId: roomId
                });
            }
            else {
                this.refreshGameList();
            }
        })
        }}
     
    render() {                                                                                      
    const shoWField = this.state.gameStarted ? 'unset': 'none';
    const shoWInfo = this.state.gameStarted ? 'flex': 'none';
    /*const showBorder = this.state.gameStarted ? '2px solid rgb(0, 255, 255)' : '0px solid rgb(0, 255, 255)';*/
    const showBorder = this.state.gameStarted ? '2px solid rgb(255, 255, 255)' : '0px solid rgb(255, 255, 255)';
    /*const showShadow = this.state.gameStarted ? '0px 0px 5px 5px rgb(80, 200, 255), inset 0px 0px 5px 5px rgb(0, 190, 255)' : '0';*/
    const showShadow = '0';
 
    var leftName = this.state.player1Name;
    var rightName = this.state.player2Name;

    return (
        <div className='Radial-background'>
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
            <div className='Page-mid'>
                <table>
                    <caption>Ongoing game</caption>
                    <tbody>
                        {this.state.game_list.map((item) => {
                            return (
                                <tr onClick={this.joinGame(item.gameID!)} className="Row">
                                    <td>{ item.player1Avatar }</td>
                                    <td>{ item.player1Name }</td>
                                    <td> VS </td>
                                    <td>{ item.player2Name }</td>
                                    <td>{ item.player2Avater }</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <RefreshButton showButton={this.state.showStartButton} clickHandler={this.refreshButtonHandler} />
                <div style={{   border: `${showBorder}`, 
                                boxShadow: `${showShadow}`,}} className='Field'>
               
                  
                    <Paddle show={this.state.gameStarted} side={"left"} y={this.state.paddleLeftY} ystart={this.state.paddleLeftY} />
                    <Paddle show={this.state.gameStarted} side={"right"} y={this.state.paddleRightY} ystart={this.state.paddleRightY} />

                    <div className='Center-zone'>           
                        
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
       
        </div>
    )}
}

function authFileHeader(): HeadersInit | undefined {
    let token = "bearer " + localStorage.getItem("userToken");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    return myHeaders;
}
