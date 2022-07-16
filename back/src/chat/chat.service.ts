import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isEmail } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, UseMsgDto } from './dto/chat.dto';
import { chatPreview, oneMsg, oneUser } from './type/chat.type';
 
@Injectable()
export class ChatService {
    chatClients = [];
    
    constructor(private readonly prisma: PrismaService) {}

    async readId(email: string)
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

    async readCid(name: string)
    {
        try {
            const channel =  await this.prisma.channel.findUnique({
                where: {
                    name: name,
                }
            })
            return (channel.id);
        } catch (error) {
            console.log('readCid error:', error);
            return null;
        }
    }

    async getChannels(email: string)
    {
        try {
            const channels = this.prisma.user.findMany({
                where:
                {
                    email: email
                },
                select:
                {
                    member: true
                    
                }
            })
            return channels;
        } catch (error) {
            console.log('get Channels error:', error);
            return null;
        }
        
    }

    async readPreview(email: string): Promise<chatPreview[]>
    {
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
        if (source.admin.length)
            for (let i = 0; i < source.admin.length; i++)
            {
                // let element: chatPreview = {
                //     name: source.admin[i].name,
                //     picture: source.admin[i].picture,
                //     updateAt: source.admin[i].picture,
                //     lastMsg: source.admin[i].messages.length > 0 ?
                //         source.admin[i].messages[0].msg : '',
                // };
                // data.push(element);
                
            }
        if (source.member.length)
            for (let i = 0; i < source.member.length; i++)
            {
                // let element: chatPreview = {
                //     name: source.member[i].name,
                //     picture: source.member[i].picture,
                //     updateAt: source.member[i].picture,
                //     lastMsg: source.member[i].messages.length > 0 ?
                //         source.member[i].messages[0].msg : '',
                // };
                // data.push(element);
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
                    admin:
                    {
                        select: 
                        {
                            name: true,
                            picture: true,
                            updatedAt: true,
                            messages:
                            {
                                where:
                                {
                                    unsent: false,
                                },
                                select:
                                {
                                    msg: true,
                                }
                            }
                        }
                    },
                    member:
                    {
                        select: 
                        {
                            name: true,
                            picture: true,
                            updatedAt: true,
                            messages:
                            {
                                where:
                                {
                                    unsent: false,
                                },
                                select:
                                {
                                    msg: true,
                                }
                            }
                        }
                    }
                }
            }
        )
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
        try {
            const id = await this.readId(data.email);
            const channel =  await this.prisma.channel.create({
                data:
                {
                    name: data.name,
                    private: data.private,
                    password: data.password,
                    owners:
                    {
                        connect:
                        {
                            email: data.email,
                        }
                    },
                    admins:
                    {
                        connect:
                        {
                            email: data.email
                        }
                    },
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
        try
        {
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

    async fetchMsgs(channelName: string): Promise<oneMsg[]>
    {
        try
        {
            const source = await this.findMsgs(channelName);
            const data = await this.organizeMsgs(source);
            return data;
        } catch (error) {
            console.log('fetchMsgs error:', error);
            throw new WsException(error);
        }
    }

    async findMsgs(channelName: string)
    {
        try
        {
            const source = this.prisma.channel.findUnique({
                where:
                {
                    name: channelName,
                },
                select:
                {
                    messages:
                    {
                        where:
                        {
                            unsent: false
                        },
                        select:
                        {
                            id: true,
                            msg: true,
                            createdAt: true,
                            updatedAt: true,
                            owner:
                            {
                                select:
                                {
                                    email: true,
                                    username: true,
                                }
                            }
                        }
                    }
                }
            })
            return source;
        } catch (error) {
            console.log('findMsgs error:', error);
            throw new WsException(error);
        }
    }
    
    async organizeMsgs(source: any): Promise<oneMsg[]>
    {
        try
        {
            let data = [];
            if (source.messages.length)
                for (let i = 0; i < source.messages.length; i++)
                {   
                    // let element: oneMsg = {
                    //     msgId: source.messages[i].id,
                    //     email: source.messages[i].owner.email,
                    //     username: source.messages[i].owner.username,
                    //     msg: source.messages[i].msg,
                    //     createAt: source.messages[i].createdAt,
                    //     updateAt: source.messages[i].updateAt,
                    // };
                    // console.log(element.email)
                    // data.push(element);
                }
            return data;
        } catch (error) {
            console.log('organizeMsgs error:', error);
            throw new WsException(error);
        }
    }

    async newMsg(data: UseMsgDto)
    {
        try {
            const id = await this.readId(data.email);
            const cid = await this.readCid(data.channel);
            const msg =  await this.prisma.msg.create({
                data:
                {
                    msg: data.msg,
                    history: [data.msg],
                    userId: id,
                    cid: cid,
                }
            })
            await this.prisma.msg.update({
                where:
                {
                    id: msg.id,
                },
                data:
                {
                    updatedAt: msg.createdAt,
                }
            })
            return msg;
        } catch (error) {
            console.log('newMsg error:', error);
            throw new WsException(error)
        } 
    }

    async deleteMsg(data: UseMsgDto) {
        try {
            await this.prisma.msg.update({
                where:
                {
                    id: data.msgId
                },
                data:
                {
                    unsent: true,
                }
            })
        } catch (error) {
            console.log('deleteMsg error:', error);
            throw new WsException(error)
        }

    }

    async editMsg(data: UseMsgDto) {
        try {
            await this.prisma.msg.update({
                where:
                {
                    id: data.msgId,
                },
                data:
                {
                    msg: data.msg,
                    history: [data.msg],
                    updatedAt: new Date(),
                }
            })
        } catch (error) {
            console.log('deleteMsg error:', error);
            throw new WsException(error)
        }

    }

    async fetchOwner(channelName: string)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    name: channelName,
                },
                select:
                {
                    owners: true,
                }
            })
            const owner = this.organizeOwner(source);
            return owner;
        } catch (error) {
            console.log('fetchAdmins error:', error);
            throw new WsException(error)
        }
    }

    organizeOwner(source: any)
    {
        // let owner: oneUser = {
        //     online: false,
        //     username: source.owner.username,
        //     email: source.owner.email,
        //     picture: source.owner.picture,
        // }
        // return owner;
    }

    async fetchAdmins(channelName: string)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    name: channelName,
                },
                select:
                {
                    admins: true,
                }
            })
            const admins = this.organizeAdmins(source);
            return admins;
        } catch (error) {
            console.log('fetchAdmins error:', error);
            throw new WsException(error)
        }
    }

    organizeAdmins(source: any)
    {
        let admins = [];
        // for (let i = 0; i < source.admins.length; i++)
        // {    
        //     let admin: oneUser = {
        //         online: false,
        //         username: source.admins[i].username,
        //         email: source.admins[i].email,
        //         picture: source.admins[i].picture,
        //     }
        //     admins.push(admin)
        // }        
        return admins;
    }

    async fetchMembers(channelName: string)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    name: channelName,
                },
                select:
                {
                    members: true,
                }
            })
            const members = this.organizeMembers(source);
            return members;
        } catch (error) {
            console.log('fetchMembers error:', error);
            throw new WsException(error)
        }
    }

    organizeMembers(source: any)
    {
        let members = [];
        // for (let i = 0; i < source.members.length; i++)
        // {    
        //     let member: oneUser = {
        //         online: false,
        //         username: source.members[i].username,
        //         email: source.members[i].email,
        //         picture: source.members[i].picture,
        //     }
        //     members.push(member);
        // }
        return members;
    }

    async suggestUsers()
    {
        try {
            const suggestion = await this.prisma.user.findMany({
                select:
                {
                    id: true,
                    email: true,
                    username: true,
                    picture: true,
                }
            })
            return suggestion;
        } catch (error) {
            console.log('suggestUsers error:', error);
            throw new WsException(error)
        }
    }

    organizeTags(source: any) {
        let users = [];
        if (source.length)
        {
            for (let i = 0; i < source.length; i++)
            {
                let user = {
                    id: source[i].id,
                    name: source[i].username,
                }
                users.push(user);
            }
        }
        return users;
    }

    async userTags()
    {
        try {
            const source = await this.suggestUsers();
            const tags = await this.organizeTags(source);
            return tags;
        } catch (error) {
            console.log('userTags error:', error);
            throw new WsException(error)
        }
    }
    
    async existedRooms()
    {
        try {
            const rooms = await this.prisma.channel.findMany({
                select:
                {
                    id: true,
                    name: true,
                }
            })
            return rooms;
        } catch (error) {
            console.log('existed rooms error:', error);
            throw new WsException(error)
        }
    }
}
