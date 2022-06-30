import { Controller,
	Get,
	Req,
	UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';


/* USER MODULES */
import { UserService } from "./user.service";
import { UserDto } from "./dto"

//this may need a constructor
/* gremit content :
	constructor(
		private userService : UsersService,
	){}
	@Get()
	getAllUsers() {
		return this.userService.findAll();
	}
*/

@Controller('users')
export class UserController {

	constructor(private userService: UserService) {}    


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
}