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
import { NewMsgDto, ChannelDto } from './dto/chat.dto';
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

    // this.chatservice.listUser();
    // this.chatservice.listChannel()
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

  @SubscribeMessage('readId')
  async handleReadId(
    @MessageBody() email: string,
    @ConnectedSocket() client: Socket) {
    const id = await this.chatservice.readId(email);
    console.log('handle read id:', id)
    client.emit('setId', id)
  }

  @SubscribeMessage('readPreview')
  async handleReadPreview(
    @MessageBody() email: string,
    @ConnectedSocket() client: Socket) {
    const data = await this.chatservice.readPreview(email);
    console.log('handle read Preview:', data)
    client.emit('setPreview', data)
  }

  // @SubscribeMessage('chatSearch')
  // async handleChatSearch(
  //   @MessageBody() keyword:string,
  //   @ConnectedSocket() client: Socket) {

  // }

  @SubscribeMessage('newChannel')
  async handleNewChannel(
  @MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    const channelId = await this.chatservice.newChannel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel exist, try another channel name!"})
    else
    {
      const ret = await this.chatservice.readPreview(data.email);
      client.emit('updatePreview', ret)
    }
  }

  @SubscribeMessage('joinChannel')
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
  handleTest(@MessageBody() data: NewMsgDto,
  @ConnectedSocket() client: Socket) {
    console.log("test  ", data)
  }

  @SubscribeMessage('msg')
  async handleNewMsg(@MessageBody() data: NewMsgDto,
  @ConnectedSocket() client: Socket
  ):Promise<Observable<WsResponse<number>>> {
    const event = 'msg';
    const response = [1];

    await this.chatservice.newMsg(data);
    this.broadcast('broadcast', data);
    return from(response).pipe(
      map(data => ({ event, data })),
    )
  }

  async broadcast(event: string, data: any) {
    const cName = await this.chatservice.findCnameByCId(data.channelId);
    this.server.in(cName).emit(event, data)
  }
}