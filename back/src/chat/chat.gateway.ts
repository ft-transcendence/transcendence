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
import { NewMsgDto, UserDto, ChannelDto } from './dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { HttpToWsFilter, ProperWsFilter } from './filter/TransformationFilter';

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
    client.emit('id', id)
  }

  @SubscribeMessage('new channel')
  async handleNewChannel(@MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    await this.chatservice.newChannel(data);
    const channelId = await this.chatservice.findChannel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel exist, try another channel name!"})
  }

  @SubscribeMessage('enter channel')
  async enterChannel(@MessageBody() data: ChannelDto,
  @ConnectedSocket() client: Socket) {
    const channelId = await this.chatservice.findChannel(data);
    if (channelId == null)
      client.emit('exception', {error: "channel not found"})
    else
    {
      client.join(data.name)
      client.emit('cid', channelId);
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