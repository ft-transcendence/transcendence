import {
	SubscribeMessage,
	WebSocketGateway,
	MessageBody,
	ConnectedSocket,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Room } from './interfaces/room.interface';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Client } from './interfaces/client.interface';
import { User } from '.prisma/client';
import { AppGateway } from 'src/app.gateway';

@WebSocketGateway({
	cors: {
		origin: process.env.FRONT_URL,
	},
	path: '/pong',
	namespace: '/gamespace',
})
export class GameGateway {
	constructor(
		private gameService: GameService,
		private readonly jwtService: JwtService,
		private userService: UserService,
		private appGateway: AppGateway,
	) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('start')
	async handleStart(@ConnectedSocket() client: Client): Promise<Player> {
		const user = await this.userService.getUser(client.data.id);

		// data to be provided to the client
		const player: Player = {
			playerNb: 0,
			roomId: 0,
		};

		if (
			GameService.rooms.length === 0 ||
			GameService.rooms[GameService.rooms.length - 1].player2 ||
			GameService.rooms[GameService.rooms.length - 1].private
		) {
			// no player in the queue
			const newId = await this.gameService.generate_new_id();
			const newRoom: Room = {
				id: newId,
				name: newId.toString(),
				player1: client,
				player1Name: await this.userService
					.getUser(client.data.id)
					.then((value: User) => value.username),
				player1Avatar: await this.userService
					.getUser(client.data.id)
					.then((value: User) => value.avatar),
				paddleLeft: 45,
				paddleRight: 45,
				paddleLeftDir: 0,
				paddleRightDir: 0,
				player1Score: 0,
				player2Score: 0,
				private: false,
			};
			GameService.rooms.push(newRoom);
			client.join(GameService.rooms[GameService.rooms.length - 1].name); // create a new websocket room
			player.playerNb = 1;
		} else {
			// one player is already waiting for an opponent

			GameService.rooms[GameService.rooms.length - 1].player2 = client;
			GameService.rooms[GameService.rooms.length - 1].player2Name =
				await this.userService
					.getUser(client.data.id)
					.then((value: User) => value.username);
			GameService.rooms[GameService.rooms.length - 1].player2Avatar =
				await this.userService
					.getUser(client.data.id)
					.then((value: User) => value.avatar);
			client.join(GameService.rooms[GameService.rooms.length - 1].name);
			this.server
				.to(GameService.rooms[GameService.rooms.length - 1].name)
				.emit('game_started', {}); // inform clients that the game is starting
			this.gameService.startGame(
				GameService.rooms[GameService.rooms.length - 1].id,
				this.server,
			);
			player.playerNb = 2;
		}

		player.roomId = GameService.rooms[GameService.rooms.length - 1].id;

		//sending status update to the front
		this.appGateway.inGameFromService(user.id);

		return player; // send data to client
	}

	// receive paddle direction data from clients (0 = none, 1 = up, 2 = down)
	@SubscribeMessage('move')
	handlemove(
		@MessageBody('room') rid: number,
		@MessageBody('player') pid: number,
		@MessageBody('dir') direction: number,
	): any {
		this.gameService.updateRoom(pid, rid, direction);
	}

	@SubscribeMessage('join')
	handlejoin(
		@MessageBody('roomId') rid: number,
		@ConnectedSocket() client: Client,
	): boolean {
		if (this.server.sockets.adapter.rooms.has(String(rid))) {
			client.join(String(rid));
			return true;
		} else {
			return false;
		}
	}

	@SubscribeMessage('unjoin')
	async handleunjoin(
		@MessageBody('roomId') rid: number,
		@ConnectedSocket() client: Client,
	): Promise<boolean> {
		if (this.server.sockets.adapter.rooms.has(String(rid))) {
			await client.leave(String(rid));
			//client.disconnect();
			return true;
		} else {
			return false;
		}
	}

	@SubscribeMessage('start_private')
	async handleStartPrivate(
		@ConnectedSocket() client: Client,
	): Promise<Player> {
		const user = await this.userService.getUser(client.data.id);

		// data to be provided to the client
		const player: Player = {
			playerNb: 0,
			roomId: 0,
		};
		const newId = await this.gameService.generate_new_id();
		const newRoom: Room = {
			id: newId,
			name: newId.toString(),
			player1: client,
			player1Name: await this.userService
				.getUser(client.data.id)
				.then((value: User) => value.username),
			player1Avatar: await this.userService
				.getUser(client.data.id)
				.then((value: User) => value.avatar),
			paddleLeft: 45,
			paddleRight: 45,
			paddleLeftDir: 0,
			paddleRightDir: 0,
			player1Score: 0,
			player2Score: 0,
			private: true,
		};
		GameService.rooms.push(newRoom);
		client.join(GameService.rooms[GameService.rooms.length - 1].name); // create a new websocket room
		player.playerNb = 1;

		player.roomId = GameService.rooms[GameService.rooms.length - 1].id;

		return player; // send data to client
	}

	@SubscribeMessage('join_private')
	async handlejoinPrivate(
		@MessageBody('roomId') rid: number,
		@ConnectedSocket() client: Client,
	): Promise<Player | boolean> {
		if (this.server.sockets.adapter.rooms.has(String(rid))) {
			const player: Player = {
				playerNb: 0,
				roomId: 0,
			};
			GameService.rooms[rid].player2 = client;
			GameService.rooms[rid].player2Name = await this.userService
				.getUser(client.data.id)
				.then((value: User) => value.username);
			GameService.rooms[rid].player2Avatar = await this.userService
				.getUser(client.data.id)
				.then((value: User) => value.avatar);
			client.join(GameService.rooms[rid].name);
			this.server
				.to(GameService.rooms[rid].name)
				.emit('game_started', {}); // inform clients that the game is starting
			this.gameService.startGame(GameService.rooms[rid].id, this.server);
			player.playerNb = 2;

			player.roomId = GameService.rooms[GameService.rooms.length - 1].id;

			return player; // send data to client
		} else {
			return false;
		}
	}
}
