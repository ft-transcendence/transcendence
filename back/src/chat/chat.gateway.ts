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
import { FormDto } from './dto';
// import { Module } from '../auth/auth.module'

@UseGuards()
@WebSocketGateway()

export class ChatGateway {
  @WebSocketServer()
  server: Server;
  
  handleConnection(client: Socket)
  {
    console.log("back connected");
  }



  // @SubscribeMessage('id')
  // handleId(
  //   @MessageBody() data: FormDto, 
  //   @ConnectedSocket() client: Socket
  // ): string {
  //   client.emit('id sent')
  //   console.log("id   ", data)
  //   return data;
  // }
  // @SubscribeMessage('pass')
  // handlePass(
  //   @MessageBody() data: string, 
  //   @ConnectedSocket() client: Socket
  // ): string {
  //   client.emit('pass sent')
  //   console.log("pass ", data)
  //   return data;
  // }

  @SubscribeMessage('msg')
  handleMsg(@MessageBody() data: FormDto,
  @ConnectedSocket() client: Socket
  ):Observable <WsResponse<number>> {
    const event = 'msg';
    const response = [1, 2, 3];

    client.emit('msg sent')
    console.log("msg  ", data)
    return from(response).pipe(
      map(data => ({ event, data })),
    )
  }
}