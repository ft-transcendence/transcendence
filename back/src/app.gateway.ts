/* eslint-disable prettier/prettier */
import { WebSocketGateway, WsException, OnGatewayConnection, OnGatewayDisconnect, BaseWsExceptionFilter, WebSocketServer  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service'; 
import { ChatService } from './chat/chat.service';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { GameService } from './game/game.service';
import { Status } from './user/statuses';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL
  },
  namespace: '/connect',
  path: '/status',
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly jwtService: JwtService, 
    private userService: UserService, 
    private chatService: ChatService, 
    private gameService: GameService
    ) {}
  
	@WebSocketServer()
	server: Server;

  userStatusMap = new Map<number, Status>();

  onlineFromService(id: number) {
    this.userStatusMap.set(id, Status.online);
    const serializedMap = [...this.userStatusMap.entries()];
    this.server.emit('update-status', serializedMap);
  }

  offlineFromService(id: number) {
    this.userStatusMap.set(id, Status.offline);
    const serializedMap = [...this.userStatusMap.entries()];
    this.server.emit('update-status', serializedMap); 
  }

  inGameFromService(id: number) {
    this.userStatusMap.set(id, Status.inGame);
    const serializedMap = [...this.userStatusMap.entries()];
    this.server.emit('update-status', serializedMap);
  }

  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
    try { 
      const UserId: number = this.jwtService.verify(String(client.handshake.headers.token), {secret: process.env.JWT_SECRET}).sub;
      const user = this.userService.getUser(UserId);
      client.data.id = UserId;
      if (!user)
        throw new WsException('Invalid token.');

      //setting status as online
      this.userStatusMap.set(client.data.id, Status.online);
      const serializedMap = [...this.userStatusMap.entries()];
      this.server.emit('update-status', serializedMap);
    }  
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding, unicorn/catch-error-name, unicorn/prevent-abbreviations
    catch(e)
    {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleDisconnect(client: Socket){

    if (client.data.id !== undefined) {
      this.userStatusMap.set(client.data.id, Status.offline)
      const serializedMap = [...this.userStatusMap.entries()];
      client.emit('update-status', serializedMap);
    }

    if (GameService.rooms.some((room) => room.player1 === client))
      GameService.rooms.find((room) => room.player1 === client).player1Disconnected = true;
    if (GameService.rooms.some((room) => room.player2 === client))
    GameService.rooms.find((room) => room.player2 === client).player2Disconnected = true;
  }
}

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
