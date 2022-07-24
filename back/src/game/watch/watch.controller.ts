import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorators';
import { GameService } from '../game.service';
import { GameData } from '../interfaces/gameData.interface';

@Controller('watch')
export class WatchController {

constructor(private gameService: GameService) {} 

//@Public()
@Get('/')
getOngoingGame() {
    return JSON.stringify(this.gameService.getGameList());
}

}