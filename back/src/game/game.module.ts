import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WatchController } from './watch/watch.controller';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { AppModule } from 'src/app.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		forwardRef(() => AppModule),
		forwardRef(() => UserModule),
	],
	providers: [GameService, GameGateway],
	controllers: [WatchController, GameController],
	exports: [GameService],
})
export class GameModule {}
