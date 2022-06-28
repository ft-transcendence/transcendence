import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(
  {cors: {origin: "http://localhost:3000" } }
)
    
export class ChatGateway {
  
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('msg')
  handleMsg(@MessageBody() data: string, 
  @ConnectedSocket() client: Socket): string {
    return data;
    client.emit('sent!')
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