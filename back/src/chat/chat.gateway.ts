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

  handleConnection(client: Socket)
  {
    console.log("back connected");
  }

  @SubscribeMessage('msg')
  handleNewMsg(@MessageBody() data: NewMsgDto,
  @ConnectedSocket() client: Socket
  ):Observable <WsResponse<number>> {
    const event = 'msg';
    const response = [1];

    console.log("msg  ", data)
    const message = this.chatservice.newMsg(data)
    client.emit('msg sent', message)
    return from(response).pipe(
      map(data => ({ event, data })),
    )
  }
}