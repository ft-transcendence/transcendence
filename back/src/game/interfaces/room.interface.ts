import { Socket } from 'socket.io';

export interface Room {
    id: number,
    name: string,
    player1: Socket,
    player2?: Socket,
    paddleLeft: number,
    paddleLeftDir: number,
    paddleRight: number,
    paddleRightDir: number,
    player1Score: number,
    player2Score: number,
    xball?: number;
    yball?: number;
    xSpeed?: number;
    ySpeed?: number;
}
