import { Socket } from "net";

export interface Game {
    id: number;
    player1: Socket;
    player2?: Socket;
    status: boolean; // true = in progress
    scorePlayer1: number;
    scorePlayer2: number;
}
