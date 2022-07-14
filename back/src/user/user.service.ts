/* GLOBAL MODULES */
import { Injectable, ForbiddenException } from "@nestjs/common";
import { use } from "passport";
import { Request } from 'express';

/* PRISMA */
import { PrismaService } from "src/prisma/prisma.service";
/* USER Modules */
import { UserDto } from './dto';
import { userInfo } from "os";
import { User } from "@prisma/client";



@Injectable()
export class UserService {

	constructor(
		private prisma: PrismaService,
		) {}

	/*	CREATE	*/

	async createUser(email: string, username: string, hash: string) {
		const user = await this.prisma.user.create({ 
			data: { 
				email,
				username,
				hash
			}
		});
		console.log(user);
		return user;
	}


	/*	READ	*/
	
	async getAllUsers() {
		//returns a record of all the users, ordered by id in acending order
		const users = await this.prisma.user.findMany({orderBy : {id: 'asc'}});

		console.log("All Users:");  //debug
		console.log(users);			//debug
		return (users);
	}
	
	
	async getLeaderboard() {
		//returns a record of all the users, ordered by gamesWon in descending order
		const users = await this.prisma.user.findMany({orderBy : {gamesWon: 'desc'}});

		console.log("Best Users:");	//debug
		console.log(users);			//debug
		return (users);
	}

	async getUser(id: number){
		try{
			const user = await this.prisma.user.findFirst({where: {id: id}});
			return (user);
		} catch (error) {
			console.log('getUser error:', error);
			throw new ForbiddenException('getUser error')
		}
	}

	
	async getFriends(id: number){
		// const friendList = await this.prisma.user.findMany({
		// 	where: {
		// 		id: id,
		// 	},
		// 	select : {
		// 		friends: true,
		// 	}
		// })
		// return (friendList);
		//error: no friends ? 
	}

	async isFriend(id1: number, id2: number){
		// if (this.getFriends(id1).find(id2))
			return (true);
		return (false);
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
		})
		return (updateUser)
	}

	async updateAvatar(id: number, newAvatar: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar: newAvatar,
			},
		})
		return (updateUser)
	}

	async updateEmail(id: number, newEmail: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				email: newEmail,
			},
		})
		return (updateUser)
	}	


	//RELATIONSHIP RELATED FUNCTIONS

	async addFriend(id: number, otherId: number){
		const user = await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				adding : {
					connect: { id: otherId },
				}
			}
		})
		return (user);
		//error: same id ?
		//error: already friend ?
	}

	// /!\ THIS IS NO LONGER RELEVANT to the added/adding duo since it will only cancel an invitation
	// once the real friends list is done, change -added- for friends
	async rmFriend(id: number, otherId: number){
		const user = await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				adding : {
					disconnect: { id: otherId },
				}
			}
		})
		return (user);
		//error: same id ?
		//error: not a friend ?
	}	
	
	async blockUser(id: number, otherId: number){
		const user = await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				blocking : {
					connect: { id: otherId },
				}
			}
		})
		return (user);
		//todo : rm from friends
		//error: same id ?
		//error: already blocked ?		
	}	

	// /!\ THIS IS NO LONGER RELEVANT to the blocked/blocking duo since it will only cancel an invitation
	// once the real friends list is done, change -blocking- for blocks	
	async unblockUser(id: number, otherId: number){
		const user = await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				blocking : {
					disconnect: { id: otherId },
				}
			}
		})
		return (user);
		//error: same id ?
		//error: not blocked ?		
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
		  })
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
		  })
	}
	async hadADraw(id: number) {
		//increments the number of won and played games by one
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				gamesPlayed: {
				  increment: 1,
				},
			  },
		  })
	}	
}
