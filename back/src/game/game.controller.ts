import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private gameService: GameService) {}

	/*	CREATE	*/

	@Post('/save_game')
	async saveGame(
		@Body('id') id: number,
		@Body('userId1') userId1: number,
		@Body('userId2') userId2: number,
		@Body('score1') score1: number,
		@Body('score2') score2: number,
		@Body('startTime') startTime: Date,
		@Body('endTime') endTime: Date,
	) {
		console.log('Going through saveGame in game.controller');
		const result = await this.gameService.saveGame(
			id,
			userId1,
			userId2,
			score1,
			score2,
			startTime,
			endTime,
		);
		return result;
	}

	/*	READ	*/


}
