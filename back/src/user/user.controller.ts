import { Body, Controller,
	Get,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
/* USER MODULES */
import { UserService } from "./user.service";
import { UserDto } from "./dto"

/*
*	CRUD :
*	- Create : Satch is doing the base user creation, maybe Flo has to initialize each var
*	- Read : Flo's stuff, are getAll and getMe enough ? No, getUser should be made too to get a specific user and access his profile
*	- Update : Flo's ugly stuff, has to understand how often and when an update happens
*	- Delete : Necessary ? In which case would we delete just a user ?
*/

@Controller('users')
export class UserController {

	constructor(private userService: UserService) {}    

	/*	READ	*/

	@Get('me') 
	getMe(@Req() request: Request) {
		// log in console
		console.log({
			user: request.user,
		})
		return request.user
	}

	@Get('him') //to change
	getUser(id: number) {
		console.log('Going through getUser in user.controller');
		return this.userService.getUser(id);
	}	

	@Get('/')	//default testing route, localhost:4000/users/
	getAllUsers() {
		console.log('Going through getAllUsers in user.controller');
		return this.userService.getAllUsers();
	}
	
	@Get()
	getLeaderboard() {
		console.log('Going through getLeaderboard in user.controller');
		return this.userService.getLeaderboard();        
	}

	//getfriends

	//idCheck (to change user params)


	/*	UPDATE	*/

	//USER PROFILE RELATED FUNCTIONS

	@Post('/update_username')
	async updateUsername(@Body('username') newUsername: string, @Req() request) {
		console.log('Going through updateUsername in user.controller');
		const result = await this.userService.updateUsername(request.user.id, newUsername);
		return (result);
	}

	@Post('/update_avatar')
	async updateAvatar(@Body('avatar') newAvatar: string, @Req() request) {
		console.log('Going through updateAvatar in user.controller');
		const result = await this.userService.updateAvatar(request.user.id, newAvatar);
		return (result);
	}

	@Post('/update_email')
	async updateEmail(@Body('email') newEmail: string, @Req() request) {
		console.log('Going through updateEmail in user.controller');
		const result = await this.userService.updateEmail(request.user.id, newEmail);
		return (result);
	}



	//RELATIONSHIP RELATED FUNCTIONS

	@Post('/add_friend')
	async addFriend(@Req() request, @Body('friendId') otherId: number){
		console.log('Going through addFriend in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.addFriend(request.user.id, otherId);
		return (result);
	}

	//rmfriend

	@Post('/block_user')
	async blockUser(@Req() request, @Body('friendId') otherId: number){
		console.log('Going through blockUser in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.addFriend(request.user.id, otherId);
		return (result);
	}

	//unblock user


	//GAME RELATED FUNCTIONS

//this is not a request - it comes from the back, called by the game, no need to protect
	hasWon(id: number) {
		console.log('Going through hasWon in user.controller for');
		return (this.userService.hasWon(id));
	}

	hasLost(id: number) {
		console.log('Going through hasLost in user.controller for');
		return (this.userService.hasLost(id));
	}

	hadADraw(id: number) {
		console.log('Going through hasWon in user.controller for');
		return (this.userService.hadADraw(id));
	}
}