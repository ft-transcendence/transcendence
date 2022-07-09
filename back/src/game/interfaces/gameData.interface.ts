import { Ball } from "./ball.interface";
import { Room } from "./room.interface";

export interface GameData {
    paddleLeft: number;
    paddleRight: number;
    xBall: number;
    yBall: number;
    player1Score: number,
    player2Score: number,
   }

