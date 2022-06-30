import { Body, Controller,
	Get,
	Req,
	UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
/* USER MODULES */
import { UserService } from "./user.service";
import { UserDto } from "./dto"

/*
*	CRUD :
*	- Create : Satch is doing the base user creation, maybe Flo has to initialize each var
*	- Read : Flo's stuff, are getAll and getMe enough ?
*	- Update : Flo's ugly stuff, has to understand how often and when an update happens
*	- Delete : Necessary ? In which case would we delete just a user ?
*/

@Controller('users')
export class UserController {

	constructor(private userService: UserService) {}    

	//READ

	@UseGuards(JwtGuard)
	@Get('me') 
	getMe(@Req() req: Request) {
		// log in console
		console.log({
			user: req.user,
		})
		return req.user;
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

	//UPDATE

//	@UseGuards(JwtGuard)
	@Get('win')
	hasWon(@Req() req: Request) {
		console.log('Going through hasWon in user.controller');
		return this.userService.hasWon(req.user);
	}

}