import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [GameModule],
	providers: [UserService, GameService],
	controllers: [UserController],
})
export class UserModule {}
