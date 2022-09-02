import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Logger,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { isNumber } from 'class-validator';
import { GetCurrentUserId } from 'src/decorators';
import { UpdateEmailDto, UpdateUsernameDto } from './dto';
/* USER MODULES */
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	logger = new Logger('UserController');

	/*	READ	*/

	@Get('me')
	getMe(@GetCurrentUserId() id: number) {
		this.logger.log('get current user');
		const userDto = this.userService.getUser(id);
		return userDto;
	}

	@Post('get_user')
	getUser(@Body('otherId') otherId: number | string) {
		this.logger.log('getUser by ID ' + otherId);
		try {
			if (isNumber(otherId)) {
				const userDto = this.userService.getUser(Number(otherId));
				return userDto;
			} else {
				const userDto = this.userService.getUserfromUsername(
					String(otherId),
				);
				return userDto;
			}
		} catch {
			throw new ForbiddenException('get_user error');
		}
	}

	@Get('/') //default testing route, localhost:4000/users/
	getAllUsers() {
		this.logger.log('getAllUsers');
		const userListDtos = this.userService.getAllUsers();
		return userListDtos;
	}

	@Get('get_leaderboard')
	getLeaderboard() {
		this.logger.log('getLeaderboard');
		return this.userService.getLeaderboard();
	}

	@Post('get_game_history')
	getGameHistory(@Body('otherId') otherId: number) {
		this.logger.log('getGameHistory otherID: ' + otherId);
		return this.userService.getGameHistory(otherId);
	}

	@Post('get_friends')
	async getFriends(@Body('otherId') otherId: number) {
		this.logger.log('getFriends otherID: ' + otherId);
		const result = await this.userService.getFriends(otherId);
		return result;
	}

	@Get('get_pending')
	async getPending(@GetCurrentUserId() id: number) {
		this.logger.log('getPending ID: ' + id);
		const result = await this.userService.getPending(id);
		return result;
	}

	@Get('get_blocked')
	async getBlocked(@GetCurrentUserId() id: number) {
		this.logger.log('getBlocked ID: ' + id);
		const result = await this.userService.getBlocks(id);
		return result;
	}

	@Get('is_friend')
	async isFriend(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('isFriend ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.isFriend(id, otherId);
		return result;
	}

	@Get('is_blocked')
	async isBlocked(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('isFriend ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.isBlocked(id, otherId);
		return result;
	}

	@Post('check_password')
	async checkPassword(
		@GetCurrentUserId() id: number,
		@Body('password') password: string,
	) {
		this.logger.log('checkPassword ID: ' + id);
		const result = await this.userService.checkPassword(id, password);
		return result;
	}

	/*	UPDATE	*/

	//USER PROFILE RELATED FUNCTIONS

	@Post('/update_username')
	async updateUsername(
		@Body('username') newUsername: UpdateUsernameDto,
		@GetCurrentUserId() id: number,
	) {
		const { username } = newUsername;
		this.logger.log(
			'updateUsername ID ' + id + ' -> username: ' + username,
		);
		try {
			const result = await this.userService.updateUsername(id, username);
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
		this.logger.log('updateAvatar ID ' + id + ' -> Avatar: ' + newAvatar);
		const result = await this.userService.updateAvatar(id, newAvatar);
		return result;
	}

	@Post('/update_email')
	async updateEmail(
		@Body('email') newEmail: UpdateEmailDto,
		@GetCurrentUserId() id: number,
	) {
		const { email } = newEmail;
		this.logger.log('updateEmail ID ' + id + ' -> email: ' + email);
		try {
			const result = await this.userService.updateEmail(id, email);
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
		this.logger.log('addFriend ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.addFriend(id, otherId);
		return result;
	}

	@Post('/rm_friend')
	async rmFriend(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('addFriend ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.rmFriend(id, otherId);

		return result;
	}

	@Post('/cancel_invite')
	async cancelInvite(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('cancelInvite ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.cancelInvite(id, otherId);
		return result;
	}

	@Post('/deny_invite')
	async denyInvite(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('denyInvite ID' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.denyInvite(id, otherId);
		return result;
	}

	@Post('/block_user')
	async blockUser(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('blockUser ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.blockUser(id, otherId);
		return result;
	}

	@Post('/unblock_user')
	async unblockUser(
		@GetCurrentUserId() id: number,
		@Body('otherId') otherId: number,
	) {
		this.logger.log('unblockUser ID: ' + id + ' -> otherID: ' + otherId);
		const result = await this.userService.unblockUser(id, otherId);
		return result;
	}
}
