import { Socket } from "socket.io-client";

export interface Game_data {
  paddleLeft?: number;
  paddleRight?: number;
  xBall?: number;
  yBall?: number;
  player1Name: string;
  player2Name: string;
  player1Avatar: number;
  player2Avater: number;
  player1Score: number;
  player2Score: number;
  gameID?: number;
}

export interface Player {
  roomId: number;
  playerNb: number;
}

export interface Coordinates {
  x?: number;
  y?: number;
  showBall: boolean;
}

export interface StatePong {
  ballX?: number;
  ballY?: number;
  paddleLeftY?: number;
  paddleRightY?: number;
  gameStarted: boolean;
  roomId: number;
  showStartButton: boolean;
  playerNumber: number;
  player1Score: number;
  player2Score: number;
  msgType: number;
  player1Name: string;
  player2Name: string;
  game_list: Game_data_extended[];
  isSettingsShown?: boolean;
  settingsState: "up" | "down" | "none";
  buttonState?: "Start" | "New Game" | "Cancel";
  avatarP1URL: string,
  avatarP2URL: string,
  soloGame: boolean,
  redirectChat?: boolean,
}

export interface PropsPong {
  pvtGame?: boolean,
  roomId?: number,
  playerNumber?: number,
  socket?: Socket;
}

export interface Button {
  clickHandler: any;
  showButton: boolean;
  buttonText?: "Start" | "New Game" | "Cancel" | "Solo mode";
}

export interface ButtonState {
  showButton: boolean;
  buttonText?: "Start" | "New Game" | "Cancel";
}

export interface SoloButtonProps {
  clickHandler: any;
  showButton: boolean;
  buttonText?: "Play again" | "Quit";
}

export interface SoloButtonState {
  showButton: boolean;
  buttonText?: "Play again" | "Quit";
}

export interface PropsSoloPong {
  clickHandler: any;
}

export interface Msg {
  showMsg: boolean;
  type: number;
}

export interface MsgState {
  showMsg: boolean;
  type: number;
}

export interface MsgSolo {
  showMsg: boolean;
  type: number;
  score: number;
}

export interface MsgSoloState {
  showMsg: boolean;
  type: number;
  score: number;
}

export interface PaddleProps {
  ystart?: number;
  y?: number;
  side: string;
  show: boolean;
}

export interface StatePaddle {
  y?: number;
  side: string;
  show: boolean;
}

export interface SettingsProps {
  onClickClose: any;
  onKeyDown: any;
  message: string;
}

export interface SettingsState {
  message: string;
}

export interface Game_data_extended extends Game_data {
  avatar1URL: string;
  avatar2URL: string;
}

export interface StateSoloPong {
  ballX: number;
  ballY: number;
  paddleLeftY: number;
  gameStarted: boolean;
  player1Score: number;
  player1Name: string;
  isSettingsShown?: boolean;
  settingsState: "up" | "down" | "none";
  avatarP1URL: string,
}
