import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, NewMsgDto, UserDto } from './dto';

@Injectable()
export class ChatService {

    constructor(private readonly prismaService: PrismaService) {}

    async signup(data: UserDto)
    {
        try {
            const user =  await this.prismaService.user.create({
            data : {
                    email: data.email,
                    hash: data.hash,
                }
            })
            return user;
        } catch (error) {
            return null;
        }
    }

    async signin(data: UserDto)
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

    async listUser()
    {
        const users = await this.prismaService.user.findMany()
        let i = 0;
        for (let user = users.at(i); user != null; user = users[i++])
            console.log('   user %d: %s', i, user.email);
        console.log('total %d users', i);
        return ;
    }

    async listChannel()
    {
        const channels = await this.prismaService.channel.findMany()
        let i = 0;
        for (let channel = channels.at(i); channel != null; channel = channels[i++])
            console.log('   channel %d: %s', i, channel.name);
        console.log('total %d channels', i);
        return ;
    }

    async newChannel(data: ChannelDto)
    {
        try {
            const channel =  await this.prismaService.channel.create({
                data: {
                    name: data.name,
                    private: data.private,
                    password: data.password,
                }
            })
            return (channel);
        } catch (error) {
            console.log('new channel error:', error)
            return null;
        } 
    }

    async findChannel(data: ChannelDto)
    {
        try {
            const channel =  await this.prismaService.channel.findFirst({
                where: {
                    name: data.name,
                }
            })
            return (channel.id);
        } catch (error) {
            console.log('find channel error:', error);
            return null;
        } 
    }

    async findCnameByCId(cid: number) {
        try{
            const channel = await this.prismaService.channel.findFirst ({
                where: {
                    id: cid,
                }
            })
            return channel.name;
        } catch (error) {
            console.log('findCnameByCid error:', error);
        }
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
