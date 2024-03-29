import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Room } from './interfaces/room.interface';
import { Server } from 'socket.io';
import { GameData } from './interfaces/gameData.interface';
import { UserService } from 'src/user/user.service';
import { Mutex } from 'async-mutex';
import { PrismaService } from 'src/prisma/prisma.service';

const refreshRate = 10;
const paddleSpeed = 1;

@Injectable()
export class GameService {
	ballSpeed = 0.25;

	constructor(
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	static rooms: Room[] = [];

	/**
	 * init ball position and direction with some randomness at the beginning of each point
	 */

	initBall(roomId: number) {
		GameService.rooms.find((room) => room.id === roomId).xball = 50;
		GameService.rooms.find((room) => room.id === roomId).yball = 50;
		GameService.rooms.find((room) => room.id === roomId).ballSpeed =
			this.ballSpeed;
		GameService.rooms.find((room) => room.id === roomId).xSpeed =
			this.ballSpeed;
		GameService.rooms.find((room) => room.id === roomId).ySpeed =
			0.15 + Math.random() * this.ballSpeed;
		let direction = Math.round(Math.random());
		if (direction)
			GameService.rooms.find((room) => room.id === roomId).xSpeed *= -1;
		direction = Math.round(Math.random());
		if (direction)
			GameService.rooms.find((room) => room.id === roomId).ySpeed *= -1;
	}

	/**
	 * update ball coordinate
	 */

	updateBall(roomId: number) {
		GameService.rooms.find((room) => room.id === roomId).xball +=
			GameService.rooms.find((room) => room.id === roomId).xSpeed;
		GameService.rooms.find((room) => room.id === roomId).yball +=
			GameService.rooms.find((room) => room.id === roomId).ySpeed;

		// game windows is 16/9 format - so 1.77, ball radius is 1vh

		// ball collision with floor or ceilling
		if (GameService.rooms.find((room) => room.id === roomId).yball > 98) {
			GameService.rooms.find((room) => room.id === roomId).yball = 98;
			GameService.rooms.find((room) => room.id === roomId).ySpeed *= -1;
		}

		if (GameService.rooms.find((room) => room.id === roomId).yball < 2) {
			GameService.rooms.find((room) => room.id === roomId).yball = 2;
			GameService.rooms.find((room) => room.id === roomId).ySpeed *= -1;
		}

		// ball collision with right paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
		if (
			GameService.rooms.find((room) => room.id === roomId).xball >=
				97 - 2 / 1.77 &&
			GameService.rooms.find((room) => room.id === roomId).yball >=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight -
					1 &&
			GameService.rooms.find((room) => room.id === roomId).yball <=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight +
					11
		) {
			// ball radius is 1vh
			GameService.rooms.find((room) => room.id === roomId).xball =
				97 - 2 / 1.77;
			GameService.rooms.find(
				(room) => room.id === roomId,
			).ballSpeed *= 1.05;
			GameService.rooms.find((room) => room.id === roomId).xSpeed *=
				-1.05;
			GameService.rooms.find((room) => room.id === roomId).ySpeed =
				((GameService.rooms.find((room) => room.id === roomId).yball -
					GameService.rooms.find((room) => room.id === roomId)
						.paddleRight -
					5) /
					6) *
				GameService.rooms.find((room) => room.id === roomId).ballSpeed; // make ball go up, straight or down based on  the part of the paddle touched
		}
		// ball collision with left paddle
		if (
			GameService.rooms.find((room) => room.id === roomId).xball <=
				3 + 2 / 1.77 &&
			GameService.rooms.find((room) => room.id === roomId).yball >=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft -
					1 &&
			GameService.rooms.find((room) => room.id === roomId).yball <=
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft +
					11
		) {
			GameService.rooms.find((room) => room.id === roomId).xball =
				3 + 2 / 1.77;
			GameService.rooms.find(
				(room) => room.id === roomId,
			).ballSpeed *= 1.05;
			GameService.rooms.find((room) => room.id === roomId).xSpeed *=
				-1.05;
			GameService.rooms.find((room) => room.id === roomId).ySpeed =
				((GameService.rooms.find((room) => room.id === roomId).yball -
					GameService.rooms.find((room) => room.id === roomId)
						.paddleLeft -
					5) /
					6) *
				GameService.rooms.find((room) => room.id === roomId).ballSpeed;
		}
		// end of point management
		if (
			GameService.rooms.find((room) => room.id === roomId).xball >=
			100 + 2 / 1.77
		) {
			GameService.rooms.find(
				(room) => room.id === roomId,
			).player1Score += 1;
			this.initBall(
				GameService.rooms.find((room) => room.id === roomId).id,
			);
		}
		if (
			GameService.rooms.find((room) => room.id === roomId).xball <=
			0 - 2 / 1.77
		) {
			GameService.rooms.find(
				(room) => room.id === roomId,
			).player2Score += 1;
			this.initBall(
				GameService.rooms.find((room) => room.id === roomId).id,
			);
		}
	}

	/**
	 * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
	 */

	updateRoom(player: number, roomId: number, direction: number) {
		if (player == 1)
			GameService.rooms.find((room) => room.id === roomId).paddleLeftDir =
				direction;
		else
			GameService.rooms.find(
				(room) => room.id === roomId,
			).paddleRightDir = direction;
	}

	/**
	 * update paddle positions based on recorded paddle directions
	 */

	updatePaddles(roomId: number) {
		if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleLeftDir == 1
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleLeft -=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft < 0
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleLeft = 0;
		} else if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleLeftDir == 2
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleLeft +=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleLeft > 90
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleLeft = 90;
		}
		if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleRightDir == 1
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleRight -=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight < 0
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleRight = 0;
		} else if (
			GameService.rooms.find((room) => room.id === roomId)
				.paddleRightDir == 2
		) {
			GameService.rooms.find((room) => room.id === roomId).paddleRight +=
				paddleSpeed;
			if (
				GameService.rooms.find((room) => room.id === roomId)
					.paddleRight > 90
			)
				GameService.rooms.find(
					(room) => room.id === roomId,
				).paddleRight = 90;
		}
	}

	/**
	 * game init
	 */

	async startGame(rid: number, server: Server) {
		const game_data: GameData = {
			paddleLeft: 45,
			paddleRight: 45,
			xBall: 50,
			yBall: 50,
			player1Score: 0,
			player2Score: 0,
			player1Name: GameService.rooms.find((room) => room.id === rid)
				.player1Name,
			player2Name: GameService.rooms.find((room) => room.id === rid)
				.player2Name,
			player1Avatar: GameService.rooms.find((room) => room.id === rid)
				.player1.data.id,
			player2Avater: GameService.rooms.find((room) => room.id === rid)
				.player2.data.id,
			startTime: new Date(),
		};
		const mutex = new Mutex();
		this.initBall(rid);
		const interval = setInterval(() => {
			this.gameLoop(rid, server, game_data, mutex);
		}, refreshRate); // create game loop
		this.schedulerRegistry.addInterval(String(rid), interval); // add game loop to the schedulerRegistry
	}

	/**
	 * game loop: update ball, update paddles, prepare data for clients, send data to clients
	 */

	async gameLoop(
		id: number,
		server: Server,
		game_data: GameData,
		mutex: Mutex,
	) {
		const release = await mutex.acquire();
		if (!GameService.rooms.some((room) => room.id === id)) {
			release();
			return;
		}
		if (
			GameService.rooms.find((room) => room.id === id)
				.player1Disconnected == true
		) {
			server
				.to(GameService.rooms.find((room) => room.id === id).name)
				.emit('disconnected', 1);
			game_data.player2Score = 11;
		} else if (
			GameService.rooms.find((room) => room.id === id)
				.player2Disconnected == true
		) {
			server
				.to(GameService.rooms.find((room) => room.id === id).name)
				.emit('disconnected', 2);
			game_data.player1Score = 11;
		} else {
			this.updateBall(id);
			this.updatePaddles(id);

			game_data.yBall = GameService.rooms.find(
				(room) => room.id === id,
			).yball;
			game_data.xBall = GameService.rooms.find(
				(room) => room.id === id,
			).xball;
			game_data.paddleLeft = GameService.rooms.find(
				(room) => room.id === id,
			).paddleLeft;
			game_data.paddleRight = GameService.rooms.find(
				(room) => room.id === id,
			).paddleRight;
			game_data.player1Score = GameService.rooms.find(
				(room) => room.id === id,
			).player1Score;
			game_data.player2Score = GameService.rooms.find(
				(room) => room.id === id,
			).player2Score;
		}
		server
			.to(GameService.rooms.find((room) => room.id === id).name)
			.emit('update', game_data);

		if (game_data.player1Score == 11 || game_data.player2Score == 11) {
			this.schedulerRegistry.deleteInterval(String(id));
			const winner =
				game_data.player1Score > game_data.player2Score ? 1 : 2;
			server
				.to(GameService.rooms.find((room) => room.id === id).name)
				.emit('end_game', winner);
			const endTime = new Date();
			this.saveGame(
				id,
				GameService.rooms.find((room) => room.id === id).player1.data
					.id,
				GameService.rooms.find((room) => room.id === id).player2.data
					.id,
				game_data.player1Score,
				game_data.player2Score,
				game_data.startTime,
				endTime,
			);
			// delete the room
			//server.sockets.in(GameService.rooms.find(room => room.id === id).name).socketsLeave(GameService.rooms.find(room => room.id === id).name);
			GameService.rooms.splice(
				GameService.rooms.findIndex((room) => room.id === id),
				1,
			);
		}
		release();
		return;
	}

	async generate_new_id(): Promise<number> {
		const id = Math.floor(Math.random() * 1_000_000 + 1);
		const usedId = await this.testID(id);
		if (!GameService.rooms.some((room) => room.id === id) && !usedId)
			return id;
		return this.generate_new_id();
	}

	getGameList(): GameData[] {
		const list: GameData[] = [];
		for (const room of GameService.rooms) {
			if (room.player2) {
				const data: GameData = {
					player1Name: room.player1Name,
					player2Name: room.player2Name,
					player1Avatar: room.player1.data.id,
					player2Avater: room.player2.data.id,
					player1Score: room.player1Score,
					player2Score: room.player2Score,
					gameID: room.id,
				};
				list.push(data);
			}
		}
		return list;
	}

	/*  GAME DATABASE RELATED FUNCTIONS */

	// CREATE

	async saveGame(
		id: number,
		userId1: number,
		userId2: number,
		score1: number,
		score2: number,
		startTime: Date,
		endTime: Date,
	) {
		const game = await this.prisma.game.create({
			data: {
				id,
				player1: userId1,
				player2: userId2,
				score1,
				score2,
				startTime,
				endTime,
			},
		});

		//update time
		const duration = Math.abs(
			game.endTime.getTime() - game.startTime.getTime(),
		);
		await this.prisma.game.update({
			where: {
				id: id,
			},
			data: {
				duration: duration,
			},
		});

		this.userService.updatePlayTime(userId1, duration);
		this.userService.updatePlayTime(userId2, duration);

		// update scores and winRate, set winner and loser
		try {
			const winnerId = score1 > score2 ? userId1 : userId2;
			const loserId = score1 > score2 ? userId2 : userId1;

			this.userService.hasWon(winnerId);
			this.userService.hasLost(loserId);

			const winner = await this.prisma.user.findUnique({
				where: {
					id: winnerId,
				},
				rejectOnNotFound: true,
			});
			const loser = await this.prisma.user.findUnique({
				where: {
					id: loserId,
				},
				rejectOnNotFound: true,
			});

			// update scores, should not be equal to 1200
			const oldScores = [winner.score, loser.score];
			const newScores = await this.userService.calculateScores(oldScores);
			if (Math.floor(newScores[0]) === 1200) newScores[0]++;
			if (Math.floor(newScores[1]) === 1200) newScores[0]--;

			await this.prisma.user.update({
				where: {
					id: winnerId,
				},
				data: {
					score: Math.floor(newScores[0]),
					gameHistory: {
						push: id,
					},
				},
			});
			await this.prisma.user.update({
				where: {
					id: loserId,
				},
				data: {
					score: Math.floor(newScores[1]),
					gameHistory: {
						push: id,
					},
				},
			});

			this.userService.updateRanks();
			return game;
		} catch (error) {
			throw new ForbiddenException('saveGame error : ' + error);
		}
	}

	// READ

	async getGame(id: number) {
		try {
			const game = await this.prisma.game.findUnique({
				where: {
					id: id,
				},
				rejectOnNotFound: true,
			});
			return game;
		} catch (error) {
			throw new ForbiddenException('getGame error : ' + error);
		}
	}

	async testID(id: number) {
		const game = await this.prisma.game.findUnique({
			where: {
				id: id,
			},
		});
		return game;
	}

	async getLastGames() {
		//returns a record of all the users, ordered by endTime in descending order
		const games = await this.prisma.game.findMany({
			orderBy: { endTime: 'desc' },
		});

		return games;
	}
}
