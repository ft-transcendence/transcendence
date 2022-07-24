import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer, WsException, OnGatewayConnection, OnGatewayDisconnect, BaseWsExceptionFilter  } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service'; 
import { ChatService } from './chat/chat.service';
import { ArgumentsHost, Catch } from '@nestjs/common';


@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly jwtService: JwtService, private userService: UserService, private chatService: ChatService) {}
  


  handleConnection(client: Socket, ...args: any[]) {
  try {  
    const UserId: number = this.jwtService.verify(String(client.handshake.headers.token), {secret: process.env.JWT_SECRET}).sub;
    const user = this.userService.getUser(UserId);
    client.data.id = UserId;
    this.chatService.chatClients.push(client);
    
    if (!user)
      throw new WsException('Invalid token.');
  }
  catch(e)
  {
    return false;
  }
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

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
