/* eslint-disable prettier/prettier */
import { WebSocketGateway, WsException, OnGatewayConnection, OnGatewayDisconnect, BaseWsExceptionFilter  } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service'; 
import { ChatService } from './chat/chat.service';
import { ArgumentsHost, Catch } from '@nestjs/common';


@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly jwtService: JwtService, private userService: UserService, private chatService: ChatService) {}
  


  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
  try {  
    const UserId: number = this.jwtService.verify(String(client.handshake.headers.token), {secret: process.env.JWT_SECRET}).sub;
    const user = this.userService.getUser(UserId);
    client.data.id = UserId;
    
    if (!user)
      throw new WsException('Invalid token.');
  }
  // eslint-disable-next-line unicorn/prefer-optional-catch-binding, unicorn/catch-error-name, unicorn/prevent-abbreviations
  catch(e)
  {
    return false;
  }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleDisconnect(){}

}

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
