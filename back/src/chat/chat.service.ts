import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isEmail } from 'class-validator';
import { elementAt } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, NewMsgDto } from './dto/chat.dto';
import { chatPreview } from './type/chat.type';

@Injectable()
export class ChatService {
    chatClients = [];
    
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

    async readPreview(email: string): Promise<chatPreview[]>
    {
        console.log("in readPreview")
        try {
            const source = await this.getChatList(email);
            const data = this.getPreview(source);
            return (data);
        } catch (error) {
            console.log('readPreview error:', error);
            return null;
        }
    }

    getPreview(source: any) {
        let data = [];
        for (let i = 0; i < source.member.length; i++)
        {   
            let element: chatPreview = {
                name: source.member[i].name,
                picture: source.member[i].picture,
                updateAt: source.member[i].picture,
                lastMsg: source.member[i].messages[0],
            };
            data.push(element);
        }
        return data;
    }

    async getChatList(email: string) {
        
            const ret = await this.prisma.user.findUnique({
                where:
                {
                    email: email,
                },
                select:
                {
                    member: {
                        select: 
                        {
                            name: true,
                            picture: true,
                            updatedAt: true,
                            messages:
                            {
                                select:
                                {
                                    msg: true,
                                }
                            }
                        }
                    }
                }
            })
        return ret;
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

    async newChannel(data: ChannelDto)
    {
        console.log("newchannel: ", data.email)
        try {
            console.log("newchannel: ", data.email)
            const channel =  await this.prisma.channel.create({
                data:
                {
                    name: data.name,
                    private: data.private,
                    password: data.password,
                    admins:
                    {
                        connect:
                        {
                            email: data.email
                        }
                    },
                    members:
                    {
                        connect: 
                        {
                            email: data.email
                        }
                    }
                }
            })
            return channel.id;
        } catch (error) {
            console.log('new channel error:', error)
            throw new WsException(error)
        } 
    }

    async joinChannel(data: ChannelDto): Promise<number>
    {
        try {
            const channel =  await this.prisma.channel.update ({
                where:
                {
                    name: data.name
                },
                data:
                {
                    members:
                    {
                        connect:
                        {
                            email: data.email,
                        }
                    }
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
