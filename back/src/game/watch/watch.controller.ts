import { Controller, Get } from '@nestjs/common';
import { GameService } from '../game.service';

@Controller('watch')
export class WatchController {
	constructor(private gameService: GameService) {}

	//@Public()
	@Get('/')
	getOngoingGame() {
		return JSON.stringify(this.gameService.getGameList());
	}
}
