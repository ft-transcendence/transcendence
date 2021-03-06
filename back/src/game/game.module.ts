import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { WatchController } from './watch/watch.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(), JwtModule.register({secret: process.env.JWT_SECRET}), UserModule
  ],

  providers: [GameService, UserService],

  controllers: [WatchController],
})

export class GameModule {}
