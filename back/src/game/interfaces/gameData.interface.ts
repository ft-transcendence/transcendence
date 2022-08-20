export interface GameData {
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
	startTime?: Date;
}
