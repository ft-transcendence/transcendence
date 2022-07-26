import { Body, Controller, Get, Post, Req } from '@nestjs/common';

/* USER MODULES */
import { GameService } from './game.service';

/*
 *	CRUD :
 *	- Create : Satch is doing the base user creation, maybe Flo has to initialize each var
 *	- Read : Flo's stuff, are getAll and getMe enough ? No, getUser should be made too to get a specific user and access his profile
 *	- Update : Flo's ugly stuff, has to understand how often and when an update happens
 *	- Delete : Necessary ? In which case would we delete just a user ?
 */

@Controller('users')
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
		@Body('startTime') startTime: number,
		@Body('endTime') endTime: number,
		@Req() request,
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
