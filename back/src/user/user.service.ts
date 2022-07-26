/* GLOBAL MODULES */
import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { plainToClass } from 'class-transformer';

/* PRISMA */
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
/* USER Modules */

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	/*	CREATE	*/

	async createUser(email: string, username: string, hash: string) {
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
		//returns a record of all the users, ordered by gamesWon in descending order
		const users = await this.prisma.user.findMany({
			orderBy: { gamesWon: 'desc' },
		});

		return users;
	}

	async getUser(id: number) {
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
				adding: true,
			},
		});
		const userList: UserDto[] = [];
		for (const element of PendingIdList) {
			for (let index = 0; index < element.adding.length; index++) {
				const user = await this.prisma.user.findUnique({
					where: { id: element.adding[index] },
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

	async updateUsername(id: number, newUsername: string, password: string) {
		if (!(await this.checkPassword(id, password)))
			throw new ForbiddenException('Invalid password');
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

	async updateAvatar(id: number, newAvatar: string, password: string) {
		if (!(await this.checkPassword(id, password)))
			throw new ForbiddenException('Invalid password');
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

	async updateEmail(id: number, newEmail: string, password: string) {
		if (!(await this.checkPassword(id, password)))
			throw new ForbiddenException('Invalid password');
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
		if (id == otherId || (await this.isFriend(id, otherId))) {
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

		this.updateFriends(id);
		this.updateFriends(otherId);

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
	}

	async denyInvite(id: number, otherId: number) {
		this.cancelInvite(otherId, id);
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
	}

	//GAME RELATED FUNCTIONS

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
		return updateUser;
	}

	async hadADraw(id: number) {
		//increments the number played games by one
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				gamesPlayed: {
					increment: 1,
				},
			},
		});
		return updateUser;
	}
}
