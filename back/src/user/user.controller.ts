import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { GetCurrentUserId } from 'src/decorators';
/* USER MODULES */
import { UserService } from './user.service';

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
	getMe(@Req() request) {
		const userDto = this.userService.getUser(request.user.id);
		return userDto;
	}

	@Get('get_user')
	getUser(@Body('otherId') otherId: number) {
		const userDto = this.userService.getUser(otherId);
		return userDto;
	}

	@Get('/') //default testing route, localhost:4000/users/
	getAllUsers() {
		console.log('Going through getAllUsers in user.controller');
		const userListDtos = this.userService.getAllUsers();
		return userListDtos;
	}

	@Get('get_leaderboard')
	getLeaderboard() {
		console.log('Going through getLeaderboard in user.controller');
		return this.userService.getLeaderboard();
	}

	@Get('get_game_history')
	getGameHistory(@Body('otherId') otherId: number) {
		console.log('Going through getGameHistory in user.controller');
		return this.userService.getGameHistory(otherId);
	}

	@Get('get_friends')
	async getFriends(@Req() request) {
		console.log('Going through getFriends in user.controller');
		const result = await this.userService.getFriends(request.user.id);
		return result;
	}

	@Get('get_pending')
	async getPending(@Req() request) {
		console.log('Going through getPending in user.controller');
		const result = await this.userService.getPending(request.user.id);
		return result;
	}

	@Get('get_blocked')
	async getBlocked(@Req() request) {
		console.log('Going through getBlocked in user.controller');
		const result = await this.userService.getBlocks(request.user.id);
		return result;
	}

	@Get('is_friend')
	async isFriend(@Req() request, @Body('otherId') otherId: number) {
		console.log('Going through isFriend in user.controller');
		const result = await this.userService.isFriend(
			request.user.id,
			otherId,
		);
		return result;
	}

	@Get('is_blocked')
	async isBlocked(@Req() request, @Body('otherId') otherId: number) {
		console.log('Going through isFriend in user.controller');
		const result = await this.userService.isBlocked(
			request.user.id,
			otherId,
		);
		return result;
	}

	@Post('check_password')
	async checkPassword(@Body('password') password: string, @Req() request) {
		console.log('Going through checkPword in user.controller');
		const result = await this.userService.checkPassword(
			request.user.id,
			password,
		);
		return result;
	}

	/*	UPDATE	*/

	//USER PROFILE RELATED FUNCTIONS

	@Post('/update_username')
	async updateUsername(
		@Body('username') newUsername: string,
		@Req() request,
	) {
		console.log('Going through updateUsername in user.controller');
		const result = await this.userService.updateUsername(
			request.user.id,
			newUsername,
		);
		return result;
	}

	@Post('/update_avatar')
	async updateAvatar(@Body('avatar') newAvatar: string, @Req() request) {
		console.log('Going through updateAvatar in user.controller');
		const result = await this.userService.updateAvatar(
			request.user.id,
			newAvatar,
		);
		return result;
	}

	@Post('/update_email')
	async updateEmail(@Body('email') newEmail: string, @Req() request) {
		console.log('Going through updateEmail in user.controller');
		const result = await this.userService.updateEmail(
			request.user.id,
			newEmail,
		);
		return result;
	}

	//RELATIONSHIP RELATED FUNCTIONS

	@Post('/add_friend')
	async addFriend(@Req() request, @Body('otherId') otherId: number) {
		//		console.log('Going through addFriend in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.addFriend(
			request.user.id,
			otherId,
		);

		return result;
	}

	@Post('/rm_friend')
	async rmFriend(@Req() request, @Body('otherId') otherId: number) {
		//		console.log('Going through addFriend in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.rmFriend(
			request.user.id,
			otherId,
		);

		return result;
	}

	@Post('/cancel_invite')
	async cancelInvite(@Req() request, @Body('otherId') otherId: number) {
		//		console.log('Going through cancelInvite in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.cancelInvite(
			request.user.id,
			otherId,
		);
		return result;
	}

	@Post('/deny_invite')
	async denyInvite(@Req() request, @Body('otherId') otherId: number) {
		//		console.log('Going through denyInvite in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.denyInvite(
			request.user.id,
			otherId,
		);
		return result;
	}

	@Post('/block_user')
	async blockUser(@Req() request, @Body('otherId') otherId: number) {
		console.log(
			'Going through blockUser in user.controller: ' +
				request.user.id +
				' -> ' +
				otherId,
		);
		const result = await this.userService.blockUser(
			request.user.id,
			otherId,
		);

		return result;
	}

	@Post('/unblock_user')
	async unblockUser(@Req() request, @Body('otherId') otherId: number) {
		console.log(
			'Going through unblockUser in user.controller: ' +
				request.user.id +
				' -> ' +
				otherId,
		);
		const result = await this.userService.unblockUser(
			request.user.id,
			otherId,
		);

		return result;
	}

	//GAME RELATED FUNCTIONS

	//this is not a request - it comes from the back, called by the game, no need to protect
	// hasWon(id: number) {
	// 	console.log('Going through hasWon in user.controller for');
	// 	return this.userService.hasWon(id);
	// }

	// hasLost(id: number) {
	// 	console.log('Going through hasLost in user.controller for');
	// 	return this.userService.hasLost(id);
	// }
}
