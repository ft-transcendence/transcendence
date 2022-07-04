import { Injectable } from '@nestjs/common';
import { prisma, PrismaClient } from '@prisma/client';
import { async } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { MsgDto } from './dto';

@Injectable()
export class ChatService {

    constructor(private prisma: PrismaService) {}

    async updater(data: MsgDto) {
        const newMsg = await this.prisma.message.create({ data })

    }
    
}
