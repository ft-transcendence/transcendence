import { Client } from './client.interface';

export interface Room {
	id: number;
	name: string;
	player1: Client;
	player1Name: string;
	player1Avatar: string;
	player2?: Client;
	player2Name?: string;
	player2Avatar?: string;
	paddleLeft: number;
	paddleLeftDir: number;
	paddleRight: number;
	paddleRightDir: number;
	player1Score: number;
	player2Score: number;
	xball?: number;
	yball?: number;
	xSpeed?: number;
	ySpeed?: number;
	private: boolean;
}
