import { UseFilters, UseGuards, WsExceptionFilter } from '@nestjs/common';
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
import { UseMsgDto, ChannelDto } from './dto/chat.dto';
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

  chatClients = [];

  handleConnection(client: Socket)
  {
    console.log('client connected: ', this.server.engine.clientsCount);
    this.chatClients.push(client);

    this.chatservice.list__allUsers();
    this.chatservice.list__allChannels()
  }

  handleDisconnect(client: Socket)
  {
    for (let i = 0; i < this.chatClients.length; i++) {
      if (this.chatClients[i] === client) {
        this.chatClients.splice(i, 1);
        break;
      }
    }
    console.log('a client disconnect, client connected:', this.chatClients.length);
  }

  async handleFetchChannel(
    email: string,
    @ConnectedSocket() client: Socket) {
    const channels = await this.chatservice.get__channels(email);
    if (channels[0].member[0])
    {
      for (let i = 0; i < channels.length; i++)
        client.join(channels[i].member[0].name);
    }
  }

  @SubscribeMessage('read preview')
  async handleReadPreview(
    @MessageBody() email: string,
    @ConnectedSocket() client: Socket) {
    await this.handleFetchChannel(email, client);
    const data = await this.chatservice.get__previews(email);
    client.emit('set preview', data)
  }

  @SubscribeMessage('add preview')
  async handleChatSearch(
    @MessageBody() channelName: string,
    @ConnectedSocket() client: Socket) {
    const preview = await this.chatservice.get__onePreview(channelName);
    client.emit('add preview', preview);

  }

  @SubscribeMessage('new channel')
  async handleNewChannel(
  @MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    const channelId = await this.chatservice.new__channel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel exist, try another channel name!"})
    else
    {
      const ret = await this.chatservice.get__previews(data.email);
      client.emit('update preview', ret)
    }
  }

  @SubscribeMessage('join channel')
  async enterChannel(@MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    
    const channelId = await this.chatservice.join__channel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel not found"})
    else
    {
      const ret = await this.chatservice.get__previews(data.email);
      client.join(data.name)
      client.emit('cid', ret);
    }
  }

  @SubscribeMessage('test')
  handleTest(
    @MessageBody() data: UseMsgDto,
    @ConnectedSocket() client: Socket) {
    console.log("test  ", data)
  }

  @SubscribeMessage('read msgs')
  async handleFetchMsgs(
    @MessageBody() channel: string,
    @ConnectedSocket() client: Socket
  ) {
    const data = await this.chatservice.fetch__msgs(channel);
    client.emit('fetch msgs', data);
  }

  @SubscribeMessage('msg')
  async handleNewMsg(@MessageBody() data: UseMsgDto,
  @ConnectedSocket() client: Socket
  ) {
    await this.chatservice.new__msg(data);
    const fetch = await this.chatservice.fetch__msgs(data.channel);
    client.emit('fetch msgs', fetch);
    const preview = await this.chatservice.get__previews(data.email);
    client.emit('update preview', preview)
  }

  @SubscribeMessage('read room status')
  async handleFetchStatus(
    @MessageBody() channel: string,
    @ConnectedSocket() client: Socket
  ) {
    const owner = await this.chatservice.fetch__owner(channel);
    client.emit('fetch owner', owner);
    const admins = await this.chatservice.fetch__admins(channel);
    client.emit('fetch admins', admins);
    const members = await this.chatservice.fetch__members(channel);
    client.emit('fetch members', members);
  }

  @SubscribeMessage('get search suggest')
  async handleSuggestUsers(
    @MessageBody() email: string,
    @ConnectedSocket() client: Socket
  ) {
    const users = await this.chatservice.get__searchSuggest(email);
    client.emit('search suggest', users);
  }

  @SubscribeMessage('get user tags')
  async handleUserTags(
    @ConnectedSocket() client: Socket
  ) {
    const tags = await this.chatservice.get__userTags();
    client.emit('user tags', tags);
  }

  @SubscribeMessage('delete msg')
  async handleDeleteMsg(
    @MessageBody() data: UseMsgDto,
    @ConnectedSocket() client: Socket
  ) {
    await this.chatservice.delete__msg(data);
    const fetch = await this.chatservice.fetch__msgs(data.channel);
    client.emit('fetch msgs', fetch);
    const preview = await this.chatservice.get__previews(data.email);
    client.emit('update preview', preview)
  }

  @SubscribeMessage('edit msg')
  async handleEditMsg(
    @MessageBody() data: UseMsgDto,
    @ConnectedSocket() client: Socket
  ) {
    await this.chatservice.edit__msg(data);
    const fetch = await this.chatservice.fetch__msgs(data.channel);
    client.emit('fetch msgs', fetch);
    const preview = await this.chatservice.get__previews(data.email);
    client.emit('update preview', preview)
  }

}