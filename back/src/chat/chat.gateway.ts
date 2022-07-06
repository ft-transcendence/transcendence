import { UseGuards } from '@nestjs/common';
// import { JwtGuard } from '../auth/guard'
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
import { NewMsgDto, UserDto } from './dto';
// import { Module } from '../auth/auth.module'

// @UseGuards(JwtGuard)
@WebSocketGateway()

export class ChatGateway {
  @WebSocketServer()
  server: Server;
  
  constructor(private readonly chatservice: ChatService) {}

  chatClients=[];

  handleConnection(client: Socket)
  {
    console.log('client connected: ', this.server.engine.clientsCount);
    client.emit('id', this.chatClients.length)
    this.chatClients.push(client);
  }
  
  handleDisconnect(client: Socket)
  {
    for (let i = 0; i < this.chatClients.length; i++) {
      if (this.chatClients[i] === client) {
        this.chatClients.splice(i, 1);
        break;
      }
    }
    this.broadcast('leave',{}, client.id);
    console.log('a client disconnect, client connected:', this.chatClients.length);
  }

  private broadcast(event: string, data: any, clientId: string){
    for (const client of this.chatClients) {
      if (client.id == clientId)
        client.emit('msg sent:', data);
      else
        client.to(data.channelId).emit(event, data)
    }
  }

  @SubscribeMessage('signup')
  handleSignup(@MessageBody() data: UserDto) {
    this.chatservice.Signup(data);
    console.log("new user:", data)
  }

  @SubscribeMessage('signin')
  handleSignin(@MessageBody() data: UserDto) {
    this.chatservice.Signin(data);
    console.log("signin:", data)
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

    console.log("dto  ", data)
    const message = this.chatservice.newMsg(data)
    this.broadcast('broadcast', data, client.id)
    return from(response).pipe(
      map(data => ({ event, data })),
    )
  }
}