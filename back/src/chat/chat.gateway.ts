import { UseGuards } from '@nestjs/common';
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
import { NewMsgDto, NewUserDto } from './dto';
// import { Module } from '../auth/auth.module'

@UseGuards()
@WebSocketGateway()

export class ChatGateway {
  @WebSocketServer()
  server: Server;
  
  constructor(private readonly chatservice: ChatService) {}

  chatClients=[];
  handleConnection(client: Socket)
  {
    console.log('client connected: ', this.server.engine.clientsCount);
    this.chatClients.push(client);
  }

  private broadcast(event: string, message: any){
    for (const client of this.chatClients) {
      console.log('id: ', client.id)
      client.emit(event, message)
    }
  }

  @SubscribeMessage('msg')
  async handleNewMsg(@MessageBody() data: NewMsgDto,
  @ConnectedSocket() client: Socket
  ):Promise<Observable<WsResponse<number>>> {
    const event = 'msg';
    const response = [1];

    console.log("dto  ", data)
    const message = this.chatservice.newMsg(data)
    this.broadcast('broadcast', data)

    client.emit('msg sent:', (await message).msg)
    return from(response).pipe(
      map(data => ({ event, data })),
    )
  }
}