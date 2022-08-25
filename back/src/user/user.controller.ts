import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { isNumber } from 'class-validator';
import { GetCurrentUserId } from 'src/decorators';
/* USER MODULES */
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	/*	READ	*/

	@Get('me')
	getMe(@GetCurrentUserId() id: number) {
		const userDto = this.userService.getUser(id);
		return userDto;
	}

	@Post('get_user')
	getUser(@Body('otherId') otherId: number | string) {
		if (isNumber(otherId)) {
			const userDto = this.userService.getUser(Number(otherId));
			return userDto;
		} else {
			const userDto = this.userService.getUserfromUsername(
				String(otherId),
			);
			return userDto;
		}
	}

	@Get('/') //default testing route, localhost:4000/users/
	getAllUsers() {
		// console.log('Going through getAllUsers in user.controller');
		const userListDtos = this.userService.getAllUsers();
		return userListDtos;
	}

	@Get('get_leaderboard')
	getLeaderboard() {
		// console.log('Going through getLeaderboard in user.controller');
		return this.userService.getLeaderboard();
	}

	@Post('get_game_history')
	getGameHistory(@Body('otherId') otherId: number) {
		console.log('Going through getGameHistory in user.controller');
		return this.userService.getGameHistory(otherId);
	}

	@Post('get_friends')
	async getFriends(@Body('otherId') otherId: number) {
		// console.log('Going through getFriends in user.controller');
		const result = await this.userService.getFriends(otherId);
		return result;

	@Get('get_pending')
	async getPending(@GetCurrentUserId() id: number) {
		// console.log('Going through getPending in user.controller');
		const result = await this.userService.getPending(id);
		return result;
	}

	@Get('get_blocked')
	async getBlocked(@GetCurrentUserId() id: number) {
		// console.log('Going through getBlocked in user.controller');
		const result = await this.userService.getBlocks(id);
		return result;
	}

	@Get('is_friend')
	async isFriend(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		// console.log('Going through isFriend in user.controller');
		const result = await this.userService.isFriend(id, otherId);
		return result;
	}

	@Get('is_blocked')
	async isBlocked(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		// console.log('Going through isFriend in user.controller');
		const result = await this.userService.isBlocked(id, otherId);
		return result;
	}

	@Post('check_password')
	async checkPassword(
		@GetCurrentUserId() id: number,
		@Body('password') password: string,
	) {
		// console.log('Going through checkPword in user.controller');
		const result = await this.userService.checkPassword(id, password);
		return result;
	}

	/*	UPDATE	*/

	//USER PROFILE RELATED FUNCTIONS

	@Post('/update_username')
	async updateUsername(
		@Body('username') newUsername: string,
		@GetCurrentUserId() id: number,
	) {
		// console.log('Going through updateUsername in user.controller');
		try {
			const result = await this.userService.updateUsername(
				id,
				newUsername,
			);
			return result;
		} catch {
			throw new ForbiddenException('Username already exists');
		}
	}

	@Post('/update_avatar')
	async updateAvatar(
		@Body('avatar') newAvatar: string,
		@GetCurrentUserId() id: number,
	) {
		// console.log('Going through updateAvatar in user.controller');
		const result = await this.userService.updateAvatar(id, newAvatar);
		return result;
	}

	@Post('/update_email')
	async updateEmail(
		@Body('email') newEmail: string,
		@GetCurrentUserId() id: number,
	) {
		// console.log('Going through updateEmail in user.controller');
		try {
			const result = await this.userService.updateEmail(id, newEmail);
			return result;
		} catch {
			throw new ForbiddenException('Email already taken');
		}
	}

	//RELATIONSHIP RELATED FUNCTIONS

	@Post('/add_friend')
	async addFriend(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		//		console.log('Going through addFriend in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.addFriend(id, otherId);
		return result;
	}

	@Post('/rm_friend')
	async rmFriend(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		//		console.log('Going through addFriend in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.rmFriend(id, otherId);

		return result;
	}

	@Post('/cancel_invite')
	async cancelInvite(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		//		console.log('Going through cancelInvite in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.cancelInvite(id, otherId);
		return result;
	}

	@Post('/deny_invite')
	async denyInvite(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		//		console.log('Going through denyInvite in user.controller: ' + request.user.id + ' -> ' + otherId);
		const result = await this.userService.denyInvite(id, otherId);
		return result;
	}

	@Post('/block_user')
	async blockUser(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		const result = await this.userService.blockUser(id, otherId);

		return result;
	}

	@Post('/unblock_user')
	async unblockUser(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		const result = await this.userService.unblockUser(id, otherId);

		return result;
	}
}
