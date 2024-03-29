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
import { UserService } from 'src/user/user.service';
import { Client } from './interfaces/client.interface';
import { User } from '.prisma/client';
import { AppGateway } from 'src/app.gateway';

@WebSocketGateway({
	cors: {
		origin: process.env.FRONT_URL,
	},
})
export class GameGateway {
	constructor(
		private gameService: GameService,
		private userService: UserService,
		private appGateway: AppGateway,
	) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('start')
	async handleStart(@ConnectedSocket() client: Client): Promise<Player> {
		const user = await this.userService.getUser(client.data.id);
		if (GameService.rooms.some((room) => room.player1.data.id === client.data.id)
		|| GameService.rooms.some((room) => {room.player2 && room.player2.data.id === client.data.id}))
		{
			return {
				playerNb: 3,
				roomId: 0,
			};
		}
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

			//sending status update to the front
			const player1Id =
				GameService.rooms[GameService.rooms.length - 1].player1.data.id;
			console.log(player1Id);
			this.appGateway.inGameFromService(user.id);
			this.appGateway.inGameFromService(player1Id);
		}

		player.roomId = GameService.rooms[GameService.rooms.length - 1].id;



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
	async handleStartPrivate(@ConnectedSocket() client: Client) {
		// const user = await this.userService.getUser(client.data.id);
		// data to be provided to the client
		// console.log('arrived in start_private');
		const newId = await this.gameService.generate_new_id();
		console.log('in start private id:', client.data.id);
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
		await client.join(GameService.rooms[GameService.rooms.length - 1].name); // create a new websocket room
		const player: Player = {
			playerNb: 1,
			roomId: GameService.rooms[GameService.rooms.length - 1].id,
		};
		this.appGateway.inGameFromService(client.data.id);
		return player;
	}

	@SubscribeMessage('join_private')
	async handlejoinPrivate(
		@MessageBody('roomId') rid: number,
		@ConnectedSocket() client: Client,
	): Promise<Player | boolean> {
		// console.log('arrive at join_private');
		if (this.server.sockets.adapter.rooms.has(String(rid))) {
			const player: Player = {
				playerNb: 0,
				roomId: 0,
			};
			if (GameService.rooms.find((room) => room.id === rid).player2)
				return false;
			GameService.rooms.find((room) => room.id === rid).player2 = client;
			GameService.rooms.find((room) => room.id === rid).player2Name =
				await this.userService
					.getUser(client.data.id)
					.then((value: User) => value.username);
			GameService.rooms.find((room) => room.id === rid).player2Avatar =
				await this.userService
					.getUser(client.data.id)
					.then((value: User) => value.avatar);
			client.join(GameService.rooms.find((room) => room.id === rid).name);
			this.server
				.to(GameService.rooms.find((room) => room.id === rid).name)
				.emit('game_started', {}); // inform clients that the game is starting
			this.gameService.startGame(rid, this.server);
			player.playerNb = 2;

			player.roomId = rid;
			// console.log('join private', player);
			return player; // send data to client
		} else {
			return false;
		}
	}
}
