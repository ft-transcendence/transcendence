/* eslint-disable prettier/prettier */
import { WebSocketGateway, WsException, OnGatewayConnection, OnGatewayDisconnect, BaseWsExceptionFilter, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service'; 
import { ChatService } from './chat/chat.service';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { GameService } from './game/game.service';
import { Status } from './user/statuses';
import { gameInvitation, updateChannel, fetchDM } from './chat/type/chat.type';
import { ChannelDto } from './chat/dto/chat.dto';
import { ChatGateway } from './chat/chat.gateway';

@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService, 
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService, 
  ) {}
  
	@WebSocketServer()
	server: Server;

  userStatusMap = new Map<number, Status>();
  clientSocket = new Map<number, Socket>();

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
  async handleConnection(client: Socket, ...args: any[]) {
    try { 
      client.setMaxListeners(20);
      const UserId: number = this.jwtService.verify(String(client.handshake.headers.token), {secret: process.env.JWT_SECRET}).sub;
      const user = this.userService.getUser(UserId);
      client.data.id = UserId;
      if (!user)
        throw new WsException('Invalid token.');

      //setting status as online
      this.userStatusMap.set(client.data.id, Status.online);
      const serializedMap = [...this.userStatusMap.entries()];
      this.server.emit('update-status', serializedMap);
      //add to clientSocket
      this.set__clientSocket(UserId, client);
      // console.log('connect userId', UserId, client.id);
      await this.chatGateway.handleJoinSocket(UserId, client);
    }  
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding, unicorn/catch-error-name, unicorn/prevent-abbreviations
    catch(e)
    {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async handleDisconnect(client: Socket){

    if (client.data.id !== undefined) {
      this.userStatusMap.set(client.data.id, Status.offline)
      const serializedMap = [...this.userStatusMap.entries()];
      client.emit('update-status', serializedMap);
      this.delete__clientSocket(client.data.id);
      // console.log('disconnect userId', client.data.id, client.id);
    }

   if (GameService.rooms.some((room) => room.player1 === client)) {
      if (!GameService.rooms.find((room) => room.player1 === client).player2)
      GameService.rooms.splice(
                GameService.rooms.findIndex((room) => room.player1 === client), 1);
      else
        GameService.rooms.find((room) => room.player1 === client).player1Disconnected = true;
    }
    if (GameService.rooms.some((room) => room.player2 === client))
    GameService.rooms.find((room) => room.player2 === client).player2Disconnected = true;
    client.removeAllListeners();
  }

	set__clientSocket(id: number, client: Socket) {
		this.clientSocket.set(id, client);
	}

	delete__clientSocket(id: number) {
		this.clientSocket.delete(id);
	}

	async get__clientSocket(id: number) {
		if (this.clientSocket.has(id)) {
			const socket = this.clientSocket.get(id);
			return socket;
		}
	}
  
  @SubscribeMessage('fetch new channel')
  async newChannelFetch(@MessageBody() data: ChannelDto) {
    data.members.map(async (member) => {
      const client = await this.get__clientSocket(member.id);
      await client.join(data.name)
      client.emit('update channel request');
    })
  }

  @SubscribeMessage('fetch new DM')
  async newDMFetch(@MessageBody() data: fetchDM) {
    const cName =  await this.chatService.get__Cname__ByCId(data.channelId);
    const client = await this.get__clientSocket(data.targetId);
    await client.join(cName);
    client.emit('update channel request');
  }

  @SubscribeMessage('fetch new invite')
  async newInviteFetch(@MessageBody() data: updateChannel) {
    const client = await this.get__clientSocket(data.targetId);
    const cName = await this.chatService.get__Cname__ByCId(data.channelId);
    await client.join(cName);
    client.emit('update channel request');
  }

	@SubscribeMessage('send invitation')
	async gameInvitation(@MessageBody() data: gameInvitation) {
		console.log('send invitation')
    const client = await this.get__clientSocket(data.targetId);
		if (client) {
      this.inGameFromService(data.targetId);
      client.emit('game invitation', data);
    }
	}

  @SubscribeMessage('decline game')
	async gameDecline(@MessageBody() game: gameInvitation) {
    console.log('decline invitation')
    const client = await this.get__clientSocket(game.inviterId);
		if (client) {
      const target = await this.userService.getUser(game.targetId);
      client.emit('rejected', target.username);
      this.onlineFromService(game.targetId);
    }
	}
}

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
