import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [forwardRef(() => UserModule), forwardRef(() => PrismaModule)],
	providers: [ChatService, ChatGateway],
	exports: [ChatGateway, ChatService],
})
export class ChatModule {}
