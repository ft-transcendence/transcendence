export interface Game_data {
    paddleLeft: number;
    paddleRight: number;
    xBall: number;
    yBall: number;
    player1Score: number,
    player2Score: number,
}

export interface Player 
{
    roomId: number;
    playerNb: number;
}

export interface Coordinates {
    x: number,
    y: number,
    showBall: boolean,
}

export interface StatePong {
    ballX: number,
    ballY: number,
    paddleLeftY: number,
    paddleRightY: number,
    gameStarted: boolean,
    roomId: number,
    showStartButton: boolean,
    playerNumber: number,
    player1Score: number,
    player2Score: number,
}

export interface Button {
    clickHandler: any;
    showButton: boolean;
}
  
export interface ButtonState {
  showButton: boolean;
}

export interface Msg {
    showMsg: boolean;
}
  
export interface MsgState {
    showMsg: boolean;
}

export interface PaddleProps {
    ystart: number,
    y: number,
    side: string,
    show: boolean,
}
  
export interface StatePaddle {
    y: number,
    side: string,
    show: boolean,
}