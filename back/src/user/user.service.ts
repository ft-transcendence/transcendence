/* GLOBAL MODULES */
import { Injectable } from "@nestjs/common";
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

	//READ
	
	//async getMe(request?)
	
	async getAllUsers() {
		//returns a record of all the users, ordered by id in acending order
		const users = await this.prisma.user.findMany({orderBy : {id: 'asc'}});

		console.log("All Users:");  //debug
		console.log(users);         //debug
		return (users);
	}
	
	
	async getLeaderboard() {
		//returns a record of all the users, ordered by gamesWon in descending order
		const users = await this.prisma.user.findMany({orderBy : {gamesWon: 'desc'}});

		console.log("Best Users:");  //debug
		console.log(users);         //debug
		return (users);
	}

	//UPDATE

	async hasWon(UserDto) {
		//increments the number of won and played games by one
		const updateUser = await this.prisma.user.updateMany({
			where: {
			  username: UserDto.username,
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
	async hasLost(UserDto) {
		//increments the number of won and played games by one
		const updateUser = await this.prisma.user.updateMany({
			where: {
			 	username: UserDto.username,
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
	async hadADraw(UserDto) {
		//increments the number of won and played games by one
		const updateUser = await this.prisma.user.update({
			where: {
				username: UserDto.username,
			},
			data: {
				gamesPlayed: {
				  increment: 1,
				},
			  },
		  })
	}	
}
