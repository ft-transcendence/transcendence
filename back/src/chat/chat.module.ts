import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from './chat.service';

@Module({
    providers: [ChatService, ChatGateway,  PrismaClient]
})
export class ChatModule {}