import { Socket } from 'socket.io';

export interface Room {
    id: number,
    name: string,
    player1: Socket,
    player2?: Socket,
    ballId?: number,
}