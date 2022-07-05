import { Injectable } from '@nestjs/common';
import { Message, Prisma, PrismaClient } from '@prisma/client';
import { async } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMsgDto, NewUserDto } from './dto';

@Injectable()
export class ChatService {

    constructor(private readonly prismaService: PrismaService) {}

    // async newUser(data: Prisma.UserCreateInput)
    // {
    //     const nUser =  await this.prismaService.user.create({
    //         data
    //         })
    //     return (nUser);
    // }

    async newMsg(data: NewMsgDto)
    {
        const message =  await this.prismaService.message.create({
            data: {
                msg: data.msg,
                history: [""],
                // userId: data.userId, 
                // cid: data.channelId,
            }
        })
        return (message);
    }

    async sendMsg(data: NewMsgDto)
    {
        const message =  await this.prismaService.message.create({
            data: {
                msg: data.msg,
                history: [""],
                // userId: data.userId, 
                // cid: data.channelId,
            }
        })
        return (message);
    }
}
