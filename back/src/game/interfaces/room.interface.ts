import { Socket } from 'socket.io';
import { Client } from './client.interface';

export interface Room {
    id: number,
    name: string,
    player1: Client,
    player2?: Client,
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
