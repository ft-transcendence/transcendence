/* GLOBAL MODULES */
import { Injectable } from "@nestjs/common";
/* PRISMA */
import { PrismaService } from "src/prisma/prisma.service";
/* USER Modules */
import { UserDto } from './dto';


@Injectable()
export class UserService {

//should have the getMe too

	constructor(
		private prisma: PrismaService,
		) {}

		
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
}
