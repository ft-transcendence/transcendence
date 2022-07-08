import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, NewMsgDto} from './dto/chat.dto';

@Injectable()
export class ChatService {

    constructor(private readonly prisma: PrismaService) {}

    async readId(email: string): Promise<number>
    {
        try {
            const user =  await this.prisma.user.findUnique({
                where: {
                    email: email,
                }
            })
            this.listUser()
            return (user.id);
        } catch (error) {
            console.log('readId error:', error);
            return null;
        }
    }

    async listUser()
    {
        const users = await this.prisma.user.findMany()
        let i = 0;
        for (let user = users.at(i); user != null; user = users[i++])
            console.log('   user %d: %s', i, user.email);
        console.log('total %d users', i);
        return ;
    }

    async listChannel()
    {
        const channels = await this.prisma.channel.findMany()
        let i = 0;
        for (let channel = channels.at(i); channel != null; channel = channels[i++])
            console.log('   channel %d: %s', i, channel.name);
        console.log('total %d channels', i);
        return ;
    }

    async newChannel(data: ChannelDto): Promise<ChannelDto>
    {
        try {
            const channel =  await this.prisma.channel.create({
                data: {
                    name: data.name,
                    private: data.private,
                    password: data.password,
                }
            })
            return (channel);
        } catch (error) {
            console.log('new channel error:', error)
            throw new WsException(error)
        } 
    }

    async findChannel(data: ChannelDto): Promise<number>
    {
        try {
            const channel =  await this.prisma.channel.findFirst({
                where: {
                    name: data.name,
                }
            })
            return (channel.id);
        } catch (error) {
            console.log('find channel error:', error);
            throw new WsException(error.message)
        } 
    }

    async findCnameByCId(cid: number): Promise<string>
    {
        try{
            const channel = await this.prisma.channel.findFirst({
                where: {
                    id: cid,
                }
            })
            return channel.name;
        } catch (error) {
            console.log('findCnameByCid error:', error);
            throw new WsException(error)
        }
    }

    async newMsg(data: NewMsgDto)
    {
        try {
            const msg =  await this.prisma.msg.create({
                data: {
                    msg: data.msg,
                    // history: [""],
                    userId: data.userId,
                    cid: data.channelId,
                }
            })
            return msg;
        } catch (error) {
            console.log('newMsg error:', error);
            throw new WsException(error)
        } 
    }
}
