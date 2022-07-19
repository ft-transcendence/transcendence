/* GLOBAL MODULES */
import { Injectable, ForbiddenException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as argon from 'argon2'


/* PRISMA */
import { PrismaService } from "src/prisma/prisma.service";
/* USER Modules */




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

	async getMe(id: number) {
		//returns a record of all the users, ordered by id in acending order
		const user = await this.prisma.user.findUnique({where : {id: id}});
		return (user);
	}

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
		const friendIdList = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select : {
				friends: true,
			}
		})
		const	friendList: User[] = [];
		for (const element of friendIdList) {
			// console.log('fL')
			for (let index = 0; index < element.friends.length; index++) {
				// console.log('indx')
				const friend = await this.prisma.user.findUnique({where: {id: element.friends[index]}})
				friendList.push(friend);
			}
		}

		return (friendList);
		//error: no friends ? 
	}

	async isFriend(id1: number, id2: number){
		// if (this.getFriends(id1).find(id2))
			return (true);
		return (false);
	}

	async idCheck(id: number, password: string) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		const pwMatches = await argon.verify(JSON.stringify(user.hash), password);
		// Invalid password
		if (!pwMatches) 
			return (false);
		return (true);
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

	async updateFriends(id: number) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		const adding = user.adding;
		const added = user.added;

		//find common values
		const commonValues = added.filter(value => adding.includes(value));

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				friends: {
					push: commonValues
			
				}
			}
		})

		//remove common values
		const NewAdding = adding.filter(value => !commonValues.includes(value));
		const NewAdded = added.filter(value => !commonValues.includes(value));

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				adding: NewAdding
			}
		})

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				added: NewAdded
			}
		})
	}

	async addFriend(id: number, otherId: number){
		const user = await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				adding: {
					push: otherId
				}
			}
		})

		const otherUser = await this.prisma.user.update({
			where: {
				id: otherId
			},
			data: {
				added: {
					push: id
				}
			}
		})
		
		this.updateFriends(id);
		this.updateFriends(otherId);

		return (user);
	}

	async rmFriend(id: number, otherId: number){

		//removing otherUser from User.friends
		const user = await this.prisma.user.findUnique({
			where: {
				id: id
			},
		})

		const index = user.friends.indexOf(otherId);
		if (index != -1) {
			user.friends.splice(index, 1)
		}

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				friends: user.friends
			}
		})

		//removing User from otherUser.friends
		const user2 = await this.prisma.user.findUnique({
			where: {
				id: otherId
			},
		})

		const index2 = user2.friends.indexOf(id);
		if (index2 != -1) {
			user2.friends.splice(index2, 1)
		}

		await this.prisma.user.update({
			where: {
				id: otherId
			},
			data: {
				friends: user2.friends
			}
		})

		return (user);
	}
	
	async cancelInvite(id: number, otherId: number){

		//removing otherUser from User.adding
		const user = await this.prisma.user.findUnique({
			where: {
				id: id
			},
		})

		const index = user.adding.indexOf(otherId);
		if (index != -1) {
			user.adding.splice(index, 1)
		}

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				adding: user.adding
			}
		})

		//removing User from otherUser.added
		const user2 = await this.prisma.user.findUnique({
			where: {
				id: otherId
			},
		})

		const index2 = user2.added.indexOf(id);
		if (index2 != -1) {
			user2.added.splice(index2, 1)
		}

		await this.prisma.user.update({
			where: {
				id: otherId
			},
			data: {
				added: user2.added
			}
		})
	}

	async denyInvite(id: number, otherId: number){
		this.cancelInvite(otherId, id);
	}


	async blockUser(id: number, otherId: number){
		this.rmFriend(id, otherId);
		const user = await this.prisma.user.findUnique({
			where: {
				id: id
			},
		})
		return (user);
		//error: same id ?
		//error: already blocked ?		
	}	

	// /!\ THIS IS NO LONGER RELEVANT to the blocked/blocking duo since it will only cancel an invitation
	// once the real friends list is done, change -blocking- for blocks	
	async unblockUser(id: number, otherId: number){
		const user = await this.prisma.user.findUnique({
			where: {
				id: id
			},
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
		return (updateUser);
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
		  return (updateUser);
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
		  })
		  return (updateUser);
	}	
}
