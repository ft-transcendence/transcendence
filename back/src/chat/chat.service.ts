import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isEmail } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, DMDto, UseMsgDto } from './dto/chat.dto';
import { chatPreview, oneMsg, oneSuggestion, oneUser } from './type/chat.type';
 
@Injectable()
export class ChatService {

    constructor(private readonly prisma: PrismaService) {}

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

    async find__CnameByCId(cid: number): Promise<string>
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
            console.log('find__CnameByCId error:', error);
            throw new WsException(error)
        }
    }

    async get__channels(email: string)
    {
        try {
            const channels = this.prisma.user.findMany({
                where:
                {
                    email: email
                },
                select:
                {
                    admin: true,
                    member: true
                }
            })
            return channels;
        } catch (error) {
            console.log('get__channels error:', error);
            return null;
        }
        
    }

    async get__previews(email: string): Promise<chatPreview[]>
    {
        try {
            const source = await this.get__chatList__ByEmail(email);
            const data = await this.organize__preview(source);
            return (data);
        } catch (error) {
            console.log('get__preview error:', error);
            return null;
        }
    }

    organize__preview(source: any) {
        let data = [];
        if (source.admin.length)
            for (let i = 0; i < source.admin.length; i++)
            {
                let msgCount = source.admin[i].messages.length;
                let element: chatPreview = {
                    id: source.admin[i].id,
                    dm: source.admin[i].dm,
                    name: source.admin[i].name,
                    picture: source.admin[i].picture,
                    updateAt: source.admin[i].picture,
                    lastMsg: msgCount > 0 ? 
                    source.admin[i].messages[msgCount - 1].msg : ''
                };
                data.push(element);
            }
        if (source.member.length)
            for (let i = 0; i < source.member.length; i++)
            {
                let msgCount = source.member[i].messages.length;
                let element: chatPreview = {
                    id: source.member[i].id,
                    dm: source.member[i].dm,
                    name: source.member[i].name,
                    picture: source.member[i].picture,
                    updateAt: source.member[i].picture,
                    lastMsg: msgCount > 0 ? 
                        source.member[i].messages[0].msg : '',
                };
                data.push(element);
            }
        return data;
    }

    async get__onePreview(channelName: string): Promise<chatPreview>
    {
        try {
            const source = await this.get__chat__ByChannelName(channelName);
            const data = this.organize__onePreview(source);
            console.log("get one pre:", data)
            return (data);
        } catch (error) {
            console.log('get__onePreview error:', error);
            return null;
        }
    }

    organize__onePreview(source: any) {
        let msgCount = 0;
        if (source.messages)
            msgCount = source.messages;
        let data: chatPreview = {
            id: source.id,
            dm: source.dm,
            name: source.name,
            updateAt: source.updateAt,
            lastMsg: msgCount > 0 ?
                source.messages[0].msg : '',
        }
        return data;
    }

    async get__chat__ByChannelName(channelName: string)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    name: channelName,
                },
                select:
                {
                    id: true,
                    dm: true,
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
                    admin:
                    {
                        select: 
                        {
                            id: true,
                            dm: true,
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
                            id: true,
                            dm: true,
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
            })
            return ret;
        } catch (error) {
            console.log('get__chatList__ByEmail error:', error)
            throw new WsException(error)
        }
            
    }

    async list__allUsers()
    {
        const users = await this.prisma.user.findMany();
        let i = 0;
        for (let user = users.at(i); user != null; user = users[i++])
            console.log('   user %d: %s', i, user.email);
        console.log('total %d users', i);
        return ;
        
    }

    async list__allChannels()
    {
        const channels = await this.prisma.channel.findMany();
        let i = 0;
        for (let channel = channels.at(i); channel != null; channel = channels[i++])
            console.log('   channel %d: %s', i, channel.name);
        console.log('total %d channels', i);
        return ;
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
            console.log("created dm", dm)
            return dm.id;
        } catch (error) {
            console.log('new__DM error:', error)
            throw new WsException(error)
        } 
    }

    async new__channel(info: ChannelDto)
    {
        try {
            const channel =  await this.prisma.channel.create({
                data:
                {
                    name: info.name,
                    private: info.private,
                    password: info.password,
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

    async join__channel(data: ChannelDto): Promise<number>
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
            console.log('join__channel error:', error);
            throw new WsException(error.message)
        } 
    }

    async fetch__msgs(channelName: string): Promise<oneMsg[]>
    {
        try
        {
            const source = await this.get__allMsgs(channelName);
            const data = await this.organize__msgs(source);
            return data;
        } catch (error) {
            console.log('fetch__msgs error:', error);
            throw new WsException(error);
        }
    }

    async get__allMsgs(channelName: string)
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
            console.log('get__allMsgs error:', error);
            throw new WsException(error);
        }
    }
    
    async organize__msgs(source: any): Promise<oneMsg[]>
    {
        try
        {
            let data = [];
            if (source.messages.length)
                for (let i = 0; i < source.messages.length; i++)
                {   
                    let element: oneMsg = {
                        msgId: source.messages[i].id,
                        email: source.messages[i].owner.email,
                        username: source.messages[i].owner.username,
                        msg: source.messages[i].msg,
                        createAt: source.messages[i].createdAt,
                        updateAt: source.messages[i].updateAt,
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
            const cid = await this.get__cId__ByCname(data.channel);
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
            console.log('new__msg error:', error);
            throw new WsException(error)
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

    async fetch__owners(channelName: string)
    {
        try {
            const source = await this.prisma.channel.findUnique({
                where:
                {
                    name: channelName,
                },
                select:
                {
                    owners: true
                }
            })
            console.log(source.owners);
            const owners = this.organize__owners(source);
            return owners;
        } catch (error) {
            console.log('fetch__owner error:', error);
            throw new WsException(error)
        }
    }

    organize__owners(source: any)
    {
        let owners = [];
        for (let i = 0; i < source.owners.length; i++)
        {    
            let owner: oneUser = {
                online: false,
                username: source.owners[i].username,
                email: source.owners[i].email,
                picture: source.owners[i].picture,
            }
            owners .push(owner)
        }        
        return owners;
    }

    async fetch__admins(channelName: string)
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
        for (let i = 0; i < source.admins.length; i++)
        {    
            let admin: oneUser = {
                online: false,
                username: source.admins[i].username,
                email: source.admins[i].email,
                picture: source.admins[i].picture,
            }
            admins.push(admin)
        }        
        return admins;
    }

    async fetch__members(channelName: string)
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
        for (let i = 0; i < source.members.length; i++)
        {    
            let member: oneUser = {
                online: false,
                username: source.members[i].username,
                email: source.members[i].email,
                picture: source.members[i].picture,
            }
            members.push(member);
        }
        return members;
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

    organize__tags(source: any) {
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

    async get__userTags()
    {
        try {
            const source = await this.get__allUsers();
            const tags = await this.organize__tags(source);
            return tags;
        } catch (error) {
            console.log('get__userTags error:', error);
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
            let myChatsLength = myChats.length;
            const usersFiltered = users.filter((user) => {
                return user.id != id;
            })

            let usersLength = usersFiltered.length;

            for (let i = 0; i < usersFiltered.length; i++)
            {
                let one: oneSuggestion = {
                    catagory: 'user',
                    picture: usersFiltered[i].picture,
                    name: usersFiltered[i].username,
                    id: i,
                    data_id: usersFiltered[i].id,
                }
                suggestion.push(one);
            }

            for (let i = 0; i < myChats.length; i++)
            {
                let one: oneSuggestion = {
                    catagory: 'my chat',
                    picture: myChats[i].picture,
                    name: myChats[i].name,
                    id: usersLength + i,
                    data_id: myChats[i].id,
                }
                suggestion.push(one);
            }

            // const existsInSuggestion = (chat) => {
                
            //     const suggestionsWhereTheChatDataIDIsTheSame = suggestion.filter((sug) => {
            //         return sug.data_id == chat.id;
            //     });

            //     return suggestionsWhereTheChatDataIDIsTheSame.length >= 1;

            // }

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
}
