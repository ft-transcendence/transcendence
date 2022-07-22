import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), JwtModule.register({secret: process.env.JWT_SECRET}), UserModule
  ],

  providers: [GameService, UserService],
})

export class GameModule {}
