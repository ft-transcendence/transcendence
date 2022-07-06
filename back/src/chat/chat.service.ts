import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewChannelDto, NewMsgDto, UserDto } from './dto';

@Injectable()
export class ChatService {

    constructor(private readonly prismaService: PrismaService) {}

    async Signup(data: UserDto)
    {
        try {
            const user =  await this.prismaService.user.create({
            data : {
                    email: data.email,
                    hash: data.hash,
                    // channel: data.channel,
                }
            })
            return user;
        } catch (error) {
            // reportError({message: error.message})
            return null;
        }
    }

    async Signin(data: UserDto)
    {
        try {
            const user =  await this.prismaService.user.findUnique({
                where: {
                    email: data.email,
                }
            })
            return (user);
        } catch (error) {
            return null;
        }
    }

    async newChannel(data: NewChannelDto)
    {
        console.log(data)
        try {
            const channel =  await this.prismaService.channel.create({
                data: {
                    name: data.name,
                    private: data.private,
                    password: data.password,
                }
            })
            return (channel);
        } catch (error) {} 
    }

    async newMsg(data: NewMsgDto)
    {
        console.log(data)
        try {
            const message =  await this.prismaService.message.create({
                data: {
                    msg: data.msg,
                    history: [""],
                    userId: data.userId.valueOf, 
                    cid: data.channelId,
                }
            })
            return (message);
        } catch (error) {} 
    }
}
