import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [UserModule, GameModule],
	providers: [ChatService, ChatGateway, UserService, GameService],
	exports: [ChatGateway, ChatService],
})
export class ChatModule {}
