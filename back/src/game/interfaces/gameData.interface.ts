export interface GameData {
	paddleLeft?: number;
	paddleRight?: number;
	xBall?: number;
	yBall?: number;
	player1Name: string;
	player2Name: string;
	player1Avatar: string;
	player2Avater: string;
	player1Score: number;
	player2Score: number;
	gameID?: number;
	startTime?: Date;
}
