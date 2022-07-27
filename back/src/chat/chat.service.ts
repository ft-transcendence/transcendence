import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, DMDto, UseMsgDto } from './dto/chat.dto';
import { chatPreview, oneMsg, oneSuggestion, oneUser, updateChannel } from './type/chat.type';
 
@Injectable()
export class ChatService {
    chatClients = [];
    
    constructor(private readonly prisma: PrismaService) {}

    async list__allUsers()
    {
        const users = await this.prisma.user.findMany();
        let count = 0;
        for (let i = 0; i < users.length; i++)
        {
            console.log('   user %d: %s', i, users[i].email);
            count = i + 1;
        }
        console.log('total %d users', count);
        return ;
        
    }

    async list__allChannels()
    {
        const channels = await this.prisma.channel.findMany();
        let count = 0;
        for (let i = 0; i < channels.length; i++)
        {
            console.log('   channel %d: %s', i, channels[i].name);
            count = i + 1;
        }
        console.log('total %d channels', count);
        return ;
    }

    async get__id__ByEmail(email: string)
    {
        try {
            const user =  await this.prisma.user.findUnique({
                where: {
                    email: email,
                }
            })
            this.list__allUsers()
            return (user.id);
        } catch (error) {
            console.log('get__id__ByEmail error:', error);
            return null;
        }
    }
    
    async get__cId__ByCname(name: string)
    {
        try {
            const channel =  await this.prisma.channel.findUnique({
                where: {
                    name: name,
                }
            })
            return (channel.id);
        } catch (error) {
            console.log('get__cId__ByCname error:', error);
            return null;
        }
    }

    async get__Cname__ByCId(cid: number)
    {
        try
        {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: cid,
                }
            })
            return channel.name;
        } catch (error) {
            console.log('get__Cname__ByCId error:', error);
            throw new WsException(error)
        }
    }

    async get__channelsToJoin(email: string)
    {
        try {
            const source = await this.prisma.user.findUnique({
                where:
                {
                    email: email
                },
                select:
                {
                    admin: true,
                    member: true,
                    invited: true
                }
            })
            const channels = this.organize__channelToJoin(source);
            return channels;
        } catch (error) {
            console.log('get__channels error:', error);
            return null;
        }
        
    }

    organize__channelToJoin(source: any)
    {
        const channels = [];
        if (source.admin)
            for (let i = 0; i < source.admin.length; i++)
            {    
                let channel = source.admin[i].name;
                channels.push(channel);
            }
        if (source.member)
            for (let i = 0; i < source.member.length; i++)
            {    
                let channel = source.member[i].name;
                channels.push(channel);
            }
        if (source.invited)
            for (let i = 0; i < source.invited.length; i++)
            {    
                let channel = source.invited[i].name;
                channels.push(channel);
            }
        return channels;
    }

    async get__previews(email: string): Promise<chatPreview[]>
    {
        try {
            const source = await this.get__chatList__ByEmail(email);
            const data = await this.organize__previews(source, email);
            return (data);
        } catch (error) {
            console.log('get__preview error:', error);
            return null;
        }
    }

    organize__previews(source: any, email: string) {
        let data = [];
        if (source.owner)
        {
            for (let i = 0; i < source.owner.length; i++)
            {
                let dmName = "";
                if (source.owner[i].owners.length > 1)
                {
                    if (source.owner[i].owners[0].email === email)
                        dmName = source.owner[i].owners[1].username;
                    else
                        dmName = source.owner[i].owners[0].username;
                }
                else
                    dmName = "No One"
                let msgCount = source.owner[i].messages.length;
                let element: chatPreview = {
                    id: source.owner[i].id,
                    dm: source.owner[i].dm,
                    name: dmName,
                    isPassword: source.owner[i].isPassword,
                    picture: source.owner[i].picture,
                    updateAt: source.owner[i].updateAt,
                    lastMsg: msgCount > 0 ? 
                    source.owner[i].messages[msgCount - 1].msg : '',
                    ownerEmail: source.owner[i].owners[0].email
                };
                data.push(element);
            }
        }
        if (source.admin)
            for (let i = 0; i < source.admin.length; i++)
            {
                let msgCount = source.admin[i].messages.length;
                let element: chatPreview = {
                    id: source.admin[i].id,
                    dm: source.admin[i].dm,
                    isPassword: source.admin[i].isPassword,
                    name: source.admin[i].name,
                    picture: source.admin[i].picture,
                    updateAt: source.admin[i].updateAt,
                    lastMsg: msgCount > 0 ? 
                    source.admin[i].messages[msgCount - 1].msg : '',
                    ownerEmail: source.admin[i].owners[0].email
                };
                data.push(element);
            }
        if (source.member)
            for (let i = 0; i < source.member.length; i++)
            {
                let msgCount = source.member[i].messages.length;
                let element: chatPreview = {
                    id: source.member[i].id,
                    dm: source.member[i].dm,
                    name: source.member[i].name,
                    isPassword: source.member[i].isPassword,
                    picture: source.member[i].picture,
                    updateAt: source.member[i].updateAt,
                    lastMsg: msgCount > 0 ? 
                        source.member[i].messages[0].msg : '',
                    ownerEmail: source.member[i].owners[0].email
                };
                data.push(element);
            }
        if (source.invited)
            for (let i = 0; i < source.invited.length; i++)
            {
                let msgCount = source.invited[i].messages.length;
                let element: chatPreview = {
                    id: source.invited[i].id,
                    dm: source.invited[i].dm,
                    name: source.invited[i].name,
                    isPassword: source.invited[i].isPassword,
                    picture: source.invited[i].picture,
                    updateAt: source.invited[i].updateAt,
                    lastMsg: source.invited[i].isPassword ? '' : (msgCount > 0 ? 
                        source.invited[i].messages[0].msg : ''),
                    ownerEmail: source.invited[i].owners[0].email
                };
                data.push(element);
            }
        return data;
    }

    async get__onePreview(channelId: number): Promise<chatPreview>
    {
        try {
            const source = await this.get__chat__ByChannelId(channelId);
            const data = this.organize__onePreview(source);
            return (data);
        } catch (error) {
            console.log('get__onePreview error:', error);
            return null;
        }
    }

    organize__onePreview(source: any) {
        let msgCount = 0;
        if (source.messages)
            msgCount = source.messages.length;
        let data: chatPreview = {
            id: source.id,
            dm: source.dm,
            name: source.name,
            isPassword: source.isPassword,
            updateAt: source.updateAt,
            lastMsg: source.isPassword ? '' : (msgCount > 0 ?
                source.messages[0].msg : ''),
            ownerEmail: source.owners.length > 0 ? 
                source.owners[0].email : ''
        }
        return data;
    }

    async get__chat__ByChannelId(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId
                },
                select:
                {
                    id: true,
                    dm: true,
                    name: true,
                    isPassword: true,
                    picture: true,
                    updatedAt: true,
                    owners:
                    {
                        select:
                        {
                            email: true,
                            username: true,
                        }
                    },
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
            })
            return source;
        } catch (error) {
            console.log('get__chat__ByChannelName error:', error)
            throw new WsException(error)
        }
    }

    async get__chatList__ByEmail(email: string) {
        try {
            const ret = await this.prisma.user.findUnique({
                where:
                {
                    email: email,
                },
                select:
                {
                    owner:
                    {
                        where:
                        {
                            dm: true,
                        },
                        select: 
                        {
                            id: true,
                            dm: true,
                            name: true,
                            picture: true,
                            isPassword: true,
                            updatedAt: true,
                            owners:
                            {
                                select:
                                {
                                    email: true,
                                    username: true,
                                }
                            },
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
                    admin:
                    {
                        select: 
                        {
                            id: true,
                            dm: true,
                            name: true,
                            isPassword: true,
                            picture: true,
                            updatedAt: true,
                            owners:
                            {
                                select:
                                {
                                    email: true,
                                    username: true,
                                }
                            },
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
                            id: true,
                            dm: true,
                            name: true,
                            isPassword: true,
                            picture: true,
                            updatedAt: true,
                            owners:
                            {
                                select:
                                {
                                    email: true,
                                    username: true,
                                }
                            },
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
                    invited:
                    {
                        select: 
                        {
                            id: true,
                            dm: true,
                            name: true,
                            isPassword: true,
                            picture: true,
                            updatedAt: true,
                            owners:
                            {
                                select:
                                {
                                    email: true,
                                    username: true,
                                }
                            },
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
            })
            return ret;
        } catch (error) {
            console.log('get__chatList__ByEmail error:', error)
            throw new WsException(error)
        }
            
    }

    async new__DM(info: DMDto)
    {
        try {
            let ids: number[] = [];
            const id = await this.get__id__ByEmail(info.email);
            ids.push(id);
            ids.push(info.added_id);
            const dm =  await this.prisma.channel.create({
                data:
                {
                    dm: true,
                    private: true,
                    owners:
                    {
                        connect:
                            ids.map(id => ({id: id}))                        
                    }
                }
            })
            return dm.id;
        } catch (error) {
            console.log('new__DM error:', error)
            throw new WsException(error)
        } 
    }

    async new__channel(info: ChannelDto)
    {
        try {
            const password = await argon.hash(info.password);
            const channel =  await this.prisma.channel.create({
                data:
                {
                    name: info.name,
                    private: info.private,
                    isPassword: info.isPassword,
                    password: password,
                    owners:
                    {
                        connect:
                        {
                            email: info.email
                        }
                    },
                    admins:
                    {
                        connect:
                        {
                            email: info.email
                        }
                    },
                    members:
                    {
                        connect:
                            info.members.map(id => ({id : id.id})),
                        
                    }
                }
            })
            return channel.id;
        } catch (error) {
            console.log('new__channel error:', error)
            throw new WsException(error)
        } 
    }

    async join__channel(data: updateChannel): Promise<number>
    {
        try {
            const database = await this.prisma.channel.findUnique ({
                where:
                {
                    id: data.channelId
                },
                select:
                {
                    password: true
                }
            })
            const pwMatches = await argon.verify(database.password, data.password);
            if (pwMatches)
            {
                const channel =  await this.prisma.channel.update ({
                    where:
                    {
                        id: data.channelId
                    },
                    data:
                    {
                        members:
                        {
                            connect:
                            {
                                email: data.email,
                            }
                        },
                        inviteds:
                        {
                            disconnect:
                            {
                                email: data.email,
                            }
                        }
                    }
                })
                return (channel.id);
            }
        } catch (error) {
            console.log('join__channel error:', error);
            throw new WsException(error.message)
        } 
    }

    async leave__channel(data: updateChannel) {
        try {
            await this.prisma.channel.update ({
                where:
                {
                    id: data.channelId
                },
                data:
                {
                    owners:
                    {
                        disconnect:
                        {
                            email: data.email
                        }
                    },
                    admins:
                    {
                        disconnect:
                        {
                            email: data.email
                        }
                    },
                    members:
                    {
                        disconnect:
                        {
                            email: data.email
                        }
                    },
                    inviteds:
                    {
                        disconnect:
                        {
                            email: data.email
                        }
                    }
                }
            })
            const channel = await this.get__chat__ByChannelId(data.channelId)
            if (channel.owners.length === 0)
            {
                await this.prisma.msg.deleteMany ({
                    where:
                    {
                        cid: data.channelId
                    }
                })
                await this.prisma.user.update({
                    where:
                    {
                        email: data.email
                    },
                    data:
                    {
                        owner:
                        {
                            disconnect:
                            {
                                id: data.channelId
                            }
                        },
                        admin:
                        {
                            disconnect:
                            {
                                id: data.channelId
                            }
                        },
                        member:
                        {
                            disconnect:
                            {
                                id: data.channelId
                            }
                        },
                        invited:
                        {
                            disconnect:
                            {
                                id: data.channelId
                            }
                        }
                    }
                })
                const deleted = await this.prisma.channel.delete ({
                    where:
                    {
                        id: data.channelId
                    }  
                })
                return deleted;
            }
        } catch (error) {
            console.log('delete__channel error:', error);
            throw new WsException(error.message)
        }
    }

    async invite__toChannel(data: updateChannel): Promise<number>
    {
        try {
            const channel = await this.prisma.channel.update ({
                where:
                {
                    id: data.channelId
                },
                data:
                {
                    inviteds:
                    {
                        connect:
                        {
                            id: data.invitedId,
                        }
                    }
                }
            })
            return channel.id;
        } catch (error) {
            console.log('invite__toChannel error:', error);
            throw new WsException(error.message)
        } 
    }

    async block__channel(data: updateChannel)
    {
        try {
            const deleted = await this.leave__channel(data);
            if (!deleted)
            {
                await this.prisma.channel.update ({
                    where:
                    {
                        id: data.channelId
                    },
                    data:
                    {
                        blocked:
                        {
                            connect:
                            {
                                email: data.email
                            }
                        }
                    }
                })
            }
        } catch (error) {
            console.log('block__channel error:', error);
            throw new WsException(error.message)
        } 
    }

    async fetch__msgs(channelId: number): Promise<oneMsg[]>
    {
        try
        {
            const source = await this.get__allMsgs(channelId);
            const data = await this.organize__msgs(source);
            return data;
        } catch (error) {
            console.log('fetch__msgs error:', error);
            throw new WsException(error);
        }
    }

    async get__allMsgs(channelId: number)
    {
        try
        {
            const source = this.prisma.channel.findUnique({
                where:
                {
                    id: channelId,
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
                                    id: true,
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
            console.log('get__allMsgs error:', error);
            throw new WsException(error);
        }
    }
    
    async organize__msgs(source: any): Promise<oneMsg[]>
    {
        try
        {
            let data = [];
            if (source.messages)
                for (let i = 0; i < source.messages.length; i++)
                {   
                    let element: oneMsg = {
                        msgId: source.messages[i].id,
                        id: source.messages[i].owner.id,
                        email: source.messages[i].owner.email,
                        username: source.messages[i].owner.username,
                        msg: source.messages[i].msg,
                        createAt: source.messages[i].createdAt,
                        updateAt: source.messages[i].updateAt,
                        isInvite: false
                    };
                    data.push(element);
                }
            return data;
        } catch (error) {
            console.log('organize__msgs error:', error);
            throw new WsException(error);
        }
    }

    async new__msg(data: UseMsgDto)
    {
        try {
            const id = await this.get__id__ByEmail(data.email);
            const msg =  await this.prisma.msg.create({
                data:
                {
                    msg: data.msg,
                    history: [data.msg],
                    userId: id,
                    cid: data.channelId,
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
            const source = await this.get__oneNewMsg(msg.id);
            const one = this.organize__oneMsg(source); 
            return one;
        } catch (error) {
            console.log('new__msg error:', error);
            throw new WsException(error)
        } 
    }

    async get__oneNewMsg(msgId: number) {
        try {
            const msg = await this.prisma.msg.findUnique({
                where:
                {
                    id: msgId,
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
                            id: true,
                            email: true,
                            username: true,
                        }
                    }
                }
            })
            return msg;
        } catch (error) {
            console.log('get__oneNewMsg error:', error);
            throw new WsException(error)
        }
    }

    async organize__oneMsg(source: any): Promise<oneMsg>
    {
        try
        {
            if (source)
            {
                let element: oneMsg = {
                    msgId: source.id,
                    id: source.owner.id,
                    email: source.owner.email,
                    username: source.owner.username,
                    msg: source.msg,
                    createAt: source.createdAt,
                    updateAt: source.updateAt,
                    isInvite: false
                };
                return element;
            }
        } catch (error) {
            console.log('organize__msgs error:', error);
            throw new WsException(error);
        }
    }

    async delete__msg(data: UseMsgDto) {
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
            console.log('delete__msg error:', error);
            throw new WsException(error)
        }

    }

    async edit__msg(data: UseMsgDto) {
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
            console.log('edit__msg error:', error);
            throw new WsException(error)
        }

    }

    async fetch__owners(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId,
                },
                select:
                {
                    owners: true
                }
            })
            const owners = this.organize__owners(source);
            return owners;
        } catch (error) {
            console.log('fetch__owners error:', error);
            throw new WsException(error)
        }
    }

    organize__owners(source: any)
    {
        let owners = [];
        if (source)
            for (let i = 0; i < source.owners.length; i++)
            {    
                let owner: oneUser = {
                    online: false,
                    username: source.owners[i].username,
                    email: source.owners[i].email,
                    picture: source.owners[i].picture,
                    isOwner: true,
                    isAdmin: true,
                    isInvited: false,
                    isMuted: false
                }
                owners.push(owner)
            }        
        return owners;
    }

    async fetch__admins(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId,
                },
                select:
                {
                    admins: true,
                }
            })
            const admins = this.organize__admins(source);
            return admins;
        } catch (error) {
            console.log('fetch__admins error:', error);
            throw new WsException(error)
        }
    }

    organize__admins(source: any)
    {
        let admins = [];
        if (source && source.admins)
            for (let i = 0; i < source.admins.length; i++)
            {    
                let admin: oneUser = {
                    online: false,
                    username: source.admins[i].username,
                    email: source.admins[i].email,
                    picture: source.admins[i].picture,
                    isOwner: false,
                    isAdmin: true,
                    isInvited: false,
                    isMuted: false
                }
                admins.push(admin)
            }        
        return admins;
    }

    async fetch__members(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId,
                },
                select:
                {
                    members: true,
                }
            })
            const members = this.organize__members(source);
            return members;
        } catch (error) {
            console.log('fetch__members error:', error);
            throw new WsException(error)
        }
    }

    organize__members(source: any)
    {
        let members = [];
        if (source && source.members)
            for (let i = 0; i < source.members.length; i++)
            {    
                let member: oneUser = {
                    online: false,
                    username: source.members[i].username,
                    email: source.members[i].email,
                    picture: source.members[i].picture,
                    isOwner: false,
                    isAdmin: false,
                    isInvited: false,
                    isMuted: false
                }
                members.push(member);
            }
        return members;
    }

    async fetch__inviteds(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId,
                },
                select:
                {
                    inviteds: true,
                }
            })
            const inviteds = this.organize__inviteds(source);
            return inviteds;
        } catch (error) {
            console.log('fetch__inviteds error:', error);
            throw new WsException(error)
        }
    }

    organize__inviteds(source: any)
    {
        let inviteds = [];
        if (source && source.inviteds)
            for (let i = 0; i < source.inviteds.length; i++)
            {    
                let member: oneUser = {
                    online: false,
                    username: source.inviteds[i].username,
                    email: source.inviteds[i].email,
                    picture: source.inviteds[i].picture,
                    isOwner: false,
                    isAdmin: false,
                    isInvited: true,
                    isMuted: false
                }
                inviteds.push(member);
            }
        return inviteds;
    }

    async get__allUsers()
    {
        try {
            const suggestion = await this.prisma.user.findMany({
                select:
                {
                    id: true,
                    username: true,
                    picture: true,
                }
            })
            return suggestion;
        } catch (error) {
            console.log('get__allUsers error:', error);
            throw new WsException(error)
        }
    }

    async get__allBlockers(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId
                },
                select:
                {
                    blocked:
                    {
                        select:
                        {
                            id: true
                        }
                    }
                }
            })
            return source;
        } catch (error) {
            console.log('get__allBlockers error:', error);
            throw new WsException(error)
        }
    }

    async get__allInsiders(channelId: number)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    id: channelId
                },
                select:
                {
                    owners:
                    {
                        select:
                        {
                            id: true,
                            username: true,
                        }
                    },
                    admins:
                    {
                        select:
                        {
                            id: true,
                            username: true,
                        }
                    },
                    members:
                    {
                        select:
                        {
                            id: true,
                            username: true,
                        }
                    },
                    inviteds:
                    {
                        select:
                        {
                            id: true,
                            username: true,
                        }
                    }
                }
            })
            const suggestion = this.organize__allInsider(source);
            return suggestion;
        } catch (error) {
            console.log('get__allInsiders error:', error);
            throw new WsException(error)
        }
    }

    organize__allInsider(source: any)
    {
        let insiders = [];
        if (source.owners)
        {
            for (let i = 0; i < source.owners.length; i++)
            {
                let insider = {
                    id: source.owners[i].id,
                    name: source.owners[i].name
                }
                insiders.push(insider);
            }
        }
        if (source.admins)
        {
            for (let i = 0; i < source.admins.length; i++)
            {
                let insider = {
                    id: source.admins[i].id,
                    name: source.admins[i].name
                }
                insiders.push(insider);
            }
        }
        if (source.members)
        {
            for (let i = 0; i < source.members.length; i++)
            {
                let insider = {
                    id: source.members[i].id,
                    name: source.members[i].name
                }
                insiders.push(insider);
            }
        }
        if (source.inviteds)
        {
            for (let i = 0; i < source.inviteds.length; i++)
            {
                let insider = {
                    id: source.inviteds[i].id,
                    name: source.inviteds[i].name
                }
                insiders.push(insider);
            }
        }
        return insiders;
    }

    organize__tags(source: any, id: number) {
        let users = [];
        if (source.length)
        {
            for (let i = 0; i < source.length; i++)
            {
                if (source[i].id !== id)
                {
                    let user = {
                        id: source[i].id,
                        name: source[i].username,
                    }
                    users.push(user);
                }
            }
        }
        return users;
    }

    async get__userTags(email: string)
    {
        try {
            const id = await this.get__id__ByEmail(email);
            const source = await this.get__allUsers();
            const tags = await this.organize__tags(source, id);
            return tags;
        } catch (error) {
            console.log('get__userTags error:', error);
            throw new WsException(error)
        }
    }

    async get__invitationTags(channelId: number)
    {
        try {
            const usersSource = await this.get__allUsers();
            const allUsers = await this.organize__tags(usersSource, -1);
            const allInsiders = await this.get__allInsiders(channelId);
            const allBlockers = await this.get__allBlockers(channelId);
            const invitationTags = await this.organize__invitationTags(allUsers, allInsiders, allBlockers);
            return invitationTags;
        } catch (error) {
            console.log('get__invitationTags error:', error);
            throw new WsException(error)
        }
    }

    async organize__invitationTags(allUsers: any, allInsiders: any, allBlockers: any)
    {
        const filterInsiders = allUsers.filter((user: any) => 
        {
            return !allInsiders.find((insider: any) => 
            {
                return user.id === insider.id;
            });
        })
        if (allBlockers.blocked.length > 0)
        {
            const filterBlockers = filterInsiders.filter((user: any) => 
            {
                return !allBlockers.blocked.find((blocker: any) => 
                {
                    return user.id === blocker.id;
                });
            })
            return filterBlockers;
        }
        return filterInsiders;
    }

    async get__blockedTags(email: string)
    {
        try {
            const id = await this.get__id__ByEmail(email);
            const source = await this.get__allBlocked(id);
            const tags = await this.organize__tags(source, -1);
            return tags;
        } catch (error) {
            console.log('get__userTags error:', error);
            throw new WsException(error)
        }
    }

    async get__allBlocked(id: number) {
        try {
            const source = await this.prisma.user.findUnique({
                where:
                {
                    id: id
                },
                select:
                {
                    blocked:
                    {
                        select:
                        {
                            id: true,
                            username: true,
                        }
                    }
                }
            })
            return source;
        } catch (error) {
            console.log('get__allBlocked error:', error);
            throw new WsException(error)
        }
    }

    async get__publicChats(email: string)
    {
        try {
            const rooms = await this.prisma.channel.findMany(
            {
                where:
                {
                    private: false,
                },
                select:
                {
                    id: true,
                    name: true,
                    picture: true,
                }
            })
            return rooms;
        } catch (error) {
            console.log('get__publicChats error:', error);
            throw new WsException(error)
        }
    }

    async organize__searchSuggest(id, users, publicChats, myChats) {
        try {

            let suggestion = [];
            let myChatsLength = 0, usersLength = 0;
            if (myChats)
            {
                myChatsLength = myChats.length;
                for (let i = 0; i < myChats.length; i++)
                {
                    let one: oneSuggestion = {
                        catagory: 'my chat',
                        picture: myChats[i].picture,
                        name: myChats[i].name,
                        id: i,
                        data_id: myChats[i].id,
                    }
                    suggestion.push(one);
                }
            }

            if (users)
            {
                const usersFiltered = users.filter((user) => {

                    return suggestion.filter((sug: oneSuggestion) => {
                        return sug.name == user.name;
                    }).length == 0 && user.id != id;
                })
    
                usersLength = usersFiltered.length;
    
                for (let i = 0; i < usersFiltered.length; i++)
                {
                    let one: oneSuggestion = {
                        catagory: 'user',
                        picture: usersFiltered[i].picture,
                        name: usersFiltered[i].username,
                        id: myChatsLength + i,
                        data_id: usersFiltered[i].id,
                    }
                    suggestion.push(one);
                }
            }

            if (publicChats)
            {
                const publicChatsFiltered = publicChats.filter((chat) => {

                    return suggestion.filter((sug) => {
                        return sug.data_id == chat.id;
                    }).length == 0;
                })
    
                for (let i = 0; i < publicChatsFiltered.length; i++)
                {
                    let one: oneSuggestion = {
                        catagory: 'public chat',
                        picture: publicChatsFiltered[i].picture,
                        name: publicChatsFiltered[i].name,
                        id: usersLength + myChatsLength + i,
                        data_id: publicChatsFiltered[i].id,
                    }
                    suggestion.push(one);
                }
            }   
            return suggestion;
        } catch (error) {
            console.log('organize__searchSuggest error:', error);
            throw new WsException(error)
        }
    }

    async get__searchSuggest(email: string)
    {
        try {
            const id = await this.get__id__ByEmail(email);
            const users = await this.get__allUsers();
            const publicChats = await this.get__publicChats(email);
            const myChats = await this.get__previews(email);
            const suggestion = await this.organize__searchSuggest(id, users, publicChats, myChats);
            return suggestion;
        } catch (error) {
            console.log('get__searchSuggest error:', error);
            throw new WsException(error)
        }
    }

    async be__admin(data: updateChannel) {
        try {
            await this.prisma.channel.update ({
                where:
                {
                    id: data.channelId
                },
                data:
                {
                    admins:
                    {
                        connect:
                        {
                            email: data.adminEmail
                        }
                    },
                    members:
                    {
                        disconnect:
                        {
                            email: data.adminEmail
                        }
                    }
                }
            })
        } catch (error) {
            console.log('be__admin error:', error);
            throw new WsException(error.message)
        }
    }

    async not__admin(data: updateChannel) {
        try {
            await this.prisma.channel.update ({
                where:
                {
                    id: data.channelId
                },
                data:
                {
                    admins:
                    {
                        disconnect:
                        {
                            email: data.adminEmail
                        }
                    },
                    members:
                    {
                        connect:
                        {
                            email: data.adminEmail
                        }
                    }
                }
            })
        } catch (error) {
            console.log('not__admin error:', error);
            throw new WsException(error.message)
        }
    }

    async get__setting(channelId: number) {
        try {
            const info = await this.prisma.channel.findUnique ({
                where:
                {
                    id: channelId
                },
                select:
                {
                    private: true,
                    isPassword: true,
                }
            })
            return info;
        } catch (error) {
            console.log('get__setting error:', error);
            throw new WsException(error.message)
        }
    }

    
    async verify__UpdateSettingRight(ownerHash: string, channelId: number)
    {
        const ownerPass = await this.prisma.channel.findUnique({
            where:
            {
                id: channelId
            },
            select:
            {
                owners:
                {
                    select:
                    {
                        hash: true
                    }
                }
            }
        })
        return await argon.verify(ownerPass.owners[0].hash, ownerHash);
    }

    async update__setting(data: updateChannel) {
        try {
            const verified = await this.verify__UpdateSettingRight(data.ownerPassword, data.channelId);
            if (verified)
            {
                await this.prisma.channel.update ({
                    where:
                    {
                        id: data.channelId
                    },
                    data:
                    {
                        private: data.private,
                        isPassword: data.isPassword
                    }
                })
                if (data.newPassword !== "")
                    await this.prisma.channel.update ({
                        where:
                        {
                            id: data.channelId
                        },
                        data:
                        {
                            password: data.newPassword
                        }
                    })
            }
        } catch (error) {
            console.log('update__setting error:', error);
            throw new WsException(error.message)
        }
    }
}
