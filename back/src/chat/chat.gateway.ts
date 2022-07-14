import { Injectable, UseFilters, UseGuards, WsExceptionFilter } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChannelDto } from './dto/chat.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { HttpToWsFilter, ProperWsFilter } from './filter/TransformationFilter';
import { isEmail } from 'class-validator';

// @UseGuards(JwtGuard)
@UsePipes(new ValidationPipe())
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())
@WebSocketGateway()

export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatservice: ChatService) {}

  async handleFetchChannel(
    email: string,
    @ConnectedSocket() client: Socket) {
    const channels = await this.chatservice.getChannels(email);
    console.log(channels)
    if (channels[0].member[0])
    {
      for (let i = 0; i < channels.length; i++)
      {  
        console.log(channels[i].member[0])
        client.join(channels[i].member[0].name);
      }
    }
  }

  @SubscribeMessage('read preview')
  async handleReadPreview(
    @MessageBody() email: string,
    @ConnectedSocket() client: Socket) {
    await this.handleFetchChannel(email, client);
    const data = await this.chatservice.readPreview(email);
    client.emit('set preview', data)
  }

  // @SubscribeMessage('chatSearch')
  // async handleChatSearch(
  //   @MessageBody() keyword:string,
  //   @ConnectedSocket() client: Socket) {

  // }

  @SubscribeMessage('new channel')
  async handleNewChannel(
  @MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    const channelId = await this.chatservice.newChannel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel exist, try another channel name!"})
    else
    {
      const ret = await this.chatservice.readPreview(data.email);
      client.emit('update preview', ret)
    }
  }

  @SubscribeMessage('join channel')
  async enterChannel(@MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    
    const channelId = await this.chatservice.joinChannel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel not found"})
    else
    {
      const ret = await this.chatservice.readPreview(data.email);
      client.join(data.name)
      client.emit('cid', ret);
    }
  }

  @SubscribeMessage('test')
  handleTest(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket) {
    console.log("test  ", data)
  }

  @SubscribeMessage('read msgs')
  async handleFetchMsgs(
    @MessageBody() channel: string,
    @ConnectedSocket() client: Socket
  ) {
    const data = await this.chatservice.fetchMsgs(channel);
    client.emit('fetch msgs', data);
  }

  @SubscribeMessage('msg')
  async handleNewMsg(@MessageBody() data: any,
  @ConnectedSocket() client: Socket
  ) {
    await this.chatservice.newMsg(data);
    const fetch = await this.chatservice.fetchMsgs(data.channel);
    client.emit('fetch msgs', fetch);
    const preview = await this.chatservice.readPreview(data.email);
    client.emit('update preview', preview)
  }

  // async broadcast(event: string, data: any) {
  //   const cName = await this.chatservice.findCnameByCId(data.channelId);
  //   this.server.in(cName).emit(event, data)
  // }

  @SubscribeMessage('read room status')
  async handleFetchStatus(
    @MessageBody() channel: string,
    @ConnectedSocket() client: Socket
  ) {
    const admins = await this.chatservice.fetchAdmins(channel);
    client.emit('fetch admins', admins);
    const members = await this.chatservice.fetchMembers(channel);
    client.emit('fetch members', members);
  }

  @SubscribeMessage('get suggest users')
  async handleSuggestUsers(
    @ConnectedSocket() client: Socket
  ) {
    // const users = await this.chatservice.suggestUsers();
    // client.emit('suggest users', users);
  }

  @SubscribeMessage('get existed rooms')
  async handleExistedRooms(
    @ConnectedSocket() client: Socket
  ) {
    // const rooms = await this.chatservice.existedRooms();
    // client.emit('existed rooms', rooms);
  }

}