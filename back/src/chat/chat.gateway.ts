import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: {
    origin: "http://localhost:3000"}})
  export class ChatGateway {

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('chat')
    handleChat(@MessageBody() data: string, 
    @ConnectedSocket() client: Socket): string {
      return data;
      client.emit('sent!')
    }
  }
  