/* GLOBAL MODULES */
import {
	Injectable,
	ForbiddenException,
	Inject,
	forwardRef,
} from '@nestjs/common';
import { Game, User } from '@prisma/client';
import * as argon from 'argon2';
import { plainToClass } from 'class-transformer';
import { GameService } from 'src/game/game.service';

/* PRISMA */
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import { SubjectiveGameDto } from 'src/game/dto';
/* USER Modules */

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => GameService)) private gameService: GameService,
	) {}

	/*	CREATE	*/

	async createUser(
		email: string,
		username: string,
		hash: string,
	): Promise<User> {
		const user = await this.prisma.user.create({
			data: {
				email,
				username,
				hash,
			},
		});
		return user;
	}

	/*	READ	*/

	async getAllUsers() {
		//returns a record of all the users, ordered by id in acending order
		const users = await this.prisma.user.findMany({
			orderBy: { id: 'asc' },
		});
		const userListDtos: UserDto[] = [];
		for (const user_ of users) {
			const user = await this.prisma.user.findUnique({
				where: {
					id: user_.id,
				},
				rejectOnNotFound: true,
			});
			const dtoUser = plainToClass(UserDto, user);
			userListDtos.push(dtoUser);
		}
		return userListDtos;
	}

	async getLeaderboard() {
		//returns a record of all the users, ordered by rank in ascending order
		const users = await this.prisma.user.findMany({
			where: {
				NOT: {
					gamesPlayed: {
						equals: 0,
					},
				},
			},
			select: {
				id: true,
				username: true,
				rank: true,
				winRate: true,
				gamesLost: true,
				gamesWon: true,
				gamesPlayed: true,
			},
			orderBy: { rank: 'desc' },
		});

		// const usersDTO: UserDto[] = [];
		// for (const user of users) {
		// 	// console.log('user:::', user);
		// 	const userDtO = plainToClass(UserDto, user);
		// 	usersDTO.push(userDtO);
		// }
		// console.log('userssss:::', usersDTO);
		return users;
	}

	async getGameHistory(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const gameHistoryInt: number[] = user.gameHistory;
		if (gameHistoryInt.length === 0) return [];

		const gameHistory: Game[] = [];
		for (const gameId of gameHistoryInt) {
			gameHistory.push(await this.gameService.getGame(gameId));
		}

		// gameHistory stores PrismaGames[], need to transform them into a SubjectiveGameDtos[]
		const gameDTOs: SubjectiveGameDto[] = [];

		for (const game of gameHistory) {
			// identify the opponent
			let opponentId: number;
			let userScore: number;
			let opponentScore: number;

			game.player1 === id
				? (opponentId = game.player2)
				: (opponentId = game.player1);
			game.player1 === id
				? (userScore = game.score1)
				: (userScore = game.score2);
			game.player1 === id
				? (opponentScore = game.score2)
				: (opponentScore = game.score1);
			const opponent: UserDto = await this.getUser(opponentId);

			// fill the SubjectiveGameDto
			const gameDTO: SubjectiveGameDto = {
				userId: id,
				opponentId: opponent.id,
				opponentAvatar: opponent.avatar,
				opponentUsername: opponent.username,
				opponentUser: opponent,
				opponentRank: opponent.rank,
				duration: game.duration,
				userScore: userScore,
				opponentScore: opponentScore,
				victory: userScore > opponentScore ? true : false,
			};
			gameDTOs.push(gameDTO);
		}

		return gameDTOs;
	}

	async getUser(id: number) {
		// console.log('id', id);
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				rejectOnNotFound: true,
			});
			const dtoUser = plainToClass(UserDto, user);
			return dtoUser;
		} catch (error) {
			// throw new ForbiddenException('getUser error : ' + error);
		}
	}

	async getUserfromUsername(username: string) {
		// console.log('username : ', username);
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					username: username,
				},
				rejectOnNotFound: true,
			});
			const dtoUser = plainToClass(UserDto, user);
			return dtoUser;
		} catch (error) {
			throw new ForbiddenException('getUser error : ' + error);
		}
	}

	async getFriends(id: number) {
		const friendIdList = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select: {
				friends: true,
			},
		});
		const friendList: UserDto[] = [];
		for (const element of friendIdList) {
			for (let index = 0; index < element.friends.length; index++) {
				const friend = await this.prisma.user.findUnique({
					where: { id: element.friends[index] },
				});
				const dtoUser = plainToClass(UserDto, friend);
				friendList.push(dtoUser);
			}
		}
		return friendList;
	}

	async getPending(id: number) {
		const PendingIdList = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select: {
				added: true,
			},
		});
		const userList: UserDto[] = [];
		for (const element of PendingIdList) {
			for (let index = 0; index < element.added.length; index++) {
				const user = await this.prisma.user.findUnique({
					where: { id: element.added[index] },
				});
				const dtoUser = plainToClass(UserDto, user);
				userList.push(dtoUser);
			}
		}
		return userList;
	}

	async isFriend(id1: number, id2: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id1,
				},
				rejectOnNotFound: true,
			});
			const index = user.friends.indexOf(id2);
			if (index != -1) {
				return true;
			}
			return false;
		} catch (error) {
			throw new ForbiddenException('isFriend error : ' + error);
		}
	}

	async isAdding(id1: number, id2: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id1,
				},
				rejectOnNotFound: true,
			});
			const index = user.adding.indexOf(id2);
			if (index != -1) {
				return true;
			}
			return false;
		} catch (error) {
			throw new ForbiddenException('isAdding error : ' + error);
		}
	}
	
	async getBlocks(id: number) {
		const BlocksIdList = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select: {
				blocks: true,
			},
		});
		const blockList: UserDto[] = [];
		for (const element of BlocksIdList) {
			for (let index = 0; index < element.blocks.length; index++) {
				const block = await this.prisma.user.findUnique({
					where: { id: element.blocks[index] },
				});
				const dtoUser = plainToClass(UserDto, block);
				blockList.push(dtoUser);
			}
		}
		return blockList;
	}

	async isBlocked(id1: number, id2: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id1,
				},
				rejectOnNotFound: true,
			});
			const index = user.blocks.indexOf(id2);
			if (index != -1) {
				return true;
			}
			return false;
		} catch (error) {
			throw new ForbiddenException('isBlocked error : ' + error);
		}
	}

	async checkPassword(id: number, password: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				rejectOnNotFound: true,
			});
			const pwMatches = await argon.verify(user.hash, password);
			// Invalid password
			if (!pwMatches) {
				console.log('Invalid password');
				return false;
			}
			return true;
		} catch (error) {
			throw new ForbiddenException('checkPassword error : ' + error);
		}
	}

	/*	UPDATE	*/

	//USER PROFILE RELATED FUNCTIONS

	async updateUsername(id: number, newUsername: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				username: newUsername,
			},
		});
		return updateUser;
	}

	async updateAvatar(id: number, newAvatar: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar: newAvatar,
			},
		});
		return updateUser;
	}

	async updateEmail(id: number, newEmail: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				email: newEmail,
			},
		});
		return updateUser;
	}

	//RELATIONSHIP RELATED FUNCTIONS

	async updateFriends(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		const adding = user.adding;
		const added = user.added;

		//find common values
		const commonValues = added.filter((value) => adding.includes(value));

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				friends: {
					push: commonValues,
				},
			},
		});

		//remove common values
		const NewAdding = adding.filter(
			(value) => !commonValues.includes(value),
		);
		const NewAdded = added.filter((value) => !commonValues.includes(value));

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				adding: NewAdding,
			},
		});

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				added: NewAdded,
			},
		});
	}

	async addFriend(id: number, otherId: number) {
		if (
			id == otherId ||
			(await this.isFriend(id, otherId)) ||
			(await this.isAdding(id, otherId))
		) {
			throw new ForbiddenException('Cannot invite this user');
		}
		const user = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				adding: {
					push: otherId,
				},
			},
		});

		const otherUser = await this.prisma.user.update({
			where: {
				id: otherId,
			},
			data: {
				added: {
					push: id,
				},
			},
		});

		await this.updateFriends(id);
		await this.updateFriends(otherId);

		return user;
	}

	async rmFriend(id: number, otherId: number) {
		if (id == otherId || !(await this.isFriend(id, otherId))) {
			throw new ForbiddenException('Cannot remove this user');
		}
		//removing otherUser from User.friends
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const index = user.friends.indexOf(otherId);
		if (index != -1) {
			user.friends.splice(index, 1);
		}

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				friends: user.friends,
			},
		});

		//removing User from otherUser.friends
		const user2 = await this.prisma.user.findUnique({
			where: {
				id: otherId,
			},
		});

		const index2 = user2.friends.indexOf(id);
		if (index2 != -1) {
			user2.friends.splice(index2, 1);
		}

		await this.prisma.user.update({
			where: {
				id: otherId,
			},
			data: {
				friends: user2.friends,
			},
		});

		return user;
	}

	async cancelInvite(id: number, otherId: number) {
		if (id == otherId) {
			throw new ForbiddenException(
				'Cannot execute this action on the user',
			);
		}
		//removing otherUser from User.adding
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const index = user.adding.indexOf(otherId);
		if (index != -1) {
			user.adding.splice(index, 1);
		}

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				adding: user.adding,
			},
		});

		//removing User from otherUser.added
		const user2 = await this.prisma.user.findUnique({
			where: {
				id: otherId,
			},
		});

		const index2 = user2.added.indexOf(id);
		if (index2 != -1) {
			user2.added.splice(index2, 1);
		}

		await this.prisma.user.update({
			where: {
				id: otherId,
			},
			data: {
				added: user2.added,
			},
		});
		return user;
	}

	async denyInvite(id: number, otherId: number) {
		return this.cancelInvite(otherId, id);
	}

	async updateBlocks(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		const blocking = user.blocking;
		const blocked = user.blocked;

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				blocks: {
					push: blocking,
				},
			},
		});
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				blocks: {
					push: blocked,
				},
			},
		});
		//empty arrays
		blocking.length = 0;
		blocked.length = 0;

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				blocking: blocking,
			},
		});

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				blocked: blocked,
			},
		});
		return user;
	}

	async blockUser(id: number, otherId: number) {
		if (id == otherId || (await this.isBlocked(id, otherId))) {
			throw new ForbiddenException('Cannot block this user');
		}
		this.rmFriend(id, otherId);
		const user = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				blocking: {
					push: otherId,
				},
			},
		});

		const otherUser = await this.prisma.user.update({
			where: {
				id: otherId,
			},
			data: {
				blocked: {
					push: id,
				},
			},
		});

		this.updateBlocks(id);
		this.updateBlocks(otherId);

		return user;
	}

	async unblockUser(id: number, otherId: number) {
		if (id == otherId || !(await this.isBlocked(id, otherId))) {
			throw new ForbiddenException('Cannot unblock this user');
		} //removing otherUser from User.blocks
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const index = user.blocks.indexOf(otherId);
		if (index != -1) {
			user.blocks.splice(index, 1);
		}

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				blocks: user.blocks,
			},
		});

		//removing User from otherUser.blocks
		const user2 = await this.prisma.user.findUnique({
			where: {
				id: otherId,
			},
		});

		const index2 = user2.blocks.indexOf(id);
		if (index2 != -1) {
			user2.blocks.splice(index2, 1);
		}

		await this.prisma.user.update({
			where: {
				id: otherId,
			},
			data: {
				blocks: user2.blocks,
			},
		});
		return user;
	}

	//GAME RELATED FUNCTIONS

	async updateRanks() {
		const users = await this.prisma.user.findMany({
			orderBy: {
				score: 'desc',
			},
			select: {
				id: true,
				score: true,
			},
		});
		const usersId: number[] = [];
		for (const user of users) {
			if (user.score !== 1200) usersId.push(user.id);
		}

		let index = 1;
		for (const id of usersId) {
			const usersUpdate = await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					rank: index,
				},
			});
			index++;
		}
		return;
	}

	async calculateScores([...ratings]) {
		const [a, b] = ratings;
		// eslint-disable-next-line unicorn/consistent-function-scoping
		const expectedScore = (self, opponent) =>
			1 / (1 + 10 ** ((opponent - self) / 400));
		const newRating = (rating, index) =>
			rating + 32 * (index - expectedScore(index ? a : b, index ? b : a));
		return [newRating(a, 1), newRating(b, 0)];
	}

	async updatePlayTime(id: number, duration: number) {
		// console.log('id = ' + id);
		// console.log('duration = ' + duration);
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				playTime: {
					increment: duration,
				},
			},
		});
		console.log('id done = ' + id);

		return updateUser;
	}

	async updateWinRate(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		const winRate = user.gamesWon / user.gamesPlayed;

		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				winRate: winRate,
			},
		});
		return updateUser;
	}

	async hasWon(id: number) {
		//increments the number of won and played games by one
		const updateUser = await this.prisma.user.updateMany({
			where: {
				id: id,
			},
			data: {
				gamesWon: {
					increment: 1,
				},
				gamesPlayed: {
					increment: 1,
				},
			},
		});
		this.updateWinRate(id);
		return updateUser;
	}

	async hasLost(id: number) {
		//increments the number of lost and played games by one
		const updateUser = await this.prisma.user.updateMany({
			where: {
				id: id,
			},
			data: {
				gamesLost: {
					increment: 1,
				},
				gamesPlayed: {
					increment: 1,
				},
			},
		});
		this.updateWinRate(id);
		return updateUser;
	}
}
