import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],

  providers: [GameService],
})

export class GameModule {}
