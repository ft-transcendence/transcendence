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

@WebSocketGateway(
  {cors: {origin: "http://localhost:3000" }, namespace: 'chat' }
)
    
export class ChatGateway {
  
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket)
  {
    console.log("connected");
  }

  @SubscribeMessage('msg')
  handleMsg(
    @MessageBody() data: string, 
    @ConnectedSocket() client: Socket
  ): string {
    client.emit('sent!')
    console.log(data)
    return data;
  }

  @SubscribeMessage('msg')
  onMsg(@MessageBody() data: string):Observable <WsResponse<number>> {
    const event = 'msg';
    const response = [1, 2, 3];

    return from(response).pipe(
      map(data => ({ event, data })),
    )
  }
}