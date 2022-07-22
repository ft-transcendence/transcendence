import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer, WsException, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service'; 
import { ChatService } from './chat/chat.service';


@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly jwtService: JwtService, private userService: UserService, private chatService: ChatService) {}
  
  async handleConnection(client: Socket, ...args: any[]) {
    try {
    const token = String(client.handshake.headers.token);
    const UserId: number = await this.jwtService.verify(token, {secret: process.env.JWT_SECRET}).userId;
    const user = await this.userService.getUser(UserId);
    client.data.id = UserId;
    this.chatService.chatClients.push(client);
    
    if (!user)
      throw new WsException('Invalid token.');
    }
    catch(e)
    {}
  }

  handleDisconnect(client: Socket)
  {
    for (let i = 0; i < this.chatService.chatClients.length; i++) {
      if (this.chatService.chatClients[i] === client) {
        this.chatService.chatClients.splice(i, 1);
        break;
      }
    }
  }

}
