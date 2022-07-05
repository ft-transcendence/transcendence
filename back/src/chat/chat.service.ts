import { Injectable } from '@nestjs/common';
import { Message, Prisma, PrismaClient } from '@prisma/client';
import { async } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMsgDto, UserDto } from './dto';

@Injectable()
export class ChatService {

    constructor(private readonly prismaService: PrismaService) {}

    async Signup(data: UserDto)
    {
        const user =  await this.prismaService.user.create({
            data : {
                email: data.email,
                hash: data.hash,
                // channel: data.channel,
            }
        })
        return (user);
    }

    async Signin(data: UserDto)
    {
        const user =  await this.prismaService.user.findUnique({
            where: {
                email: data.email,
            }
        })
        return (user);
    }

    async newMsg(data: NewMsgDto)
    {
        console.log(data)
        const message =  await this.prismaService.message.create({
            data: {
                msg: data.msg,
                history: [""],
                userId: data.userId, 
                cid: data.channelId,
            }
        })
        return (message);
    }
}
