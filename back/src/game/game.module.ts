import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { WatchController } from './watch/watch.controller';
import { GameController } from './game.controller';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		JwtModule.register({ secret: process.env.JWT_SECRET }),
	],

	providers: [GameService, UserService],

	controllers: [WatchController, GameController],
})
export class GameModule {}
