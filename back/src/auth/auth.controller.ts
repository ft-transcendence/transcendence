
/**
 * AUTHENTIFICATION CONTROLLER
 */

/* GLOBAL MODULES */
import { Body, Controller, Get, Post } from "@nestjs/common";
/* AUTH MODULES */
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto"
import { SignInDto } from "./dto"

// AUTH CONTROLLER
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	
	/**
	 * Testing basic /auth route 
	 */

	@Get('/')
	test_auth() {
		return this.authService.test_route();
	}

	/**
	 *	/signup - create account 
	 * @param dto data transfer object
	 */
	@Post('signup')
	signup(@Body() dto: SignUpDto) {
		console.log(dto);
		return this.authService.signup(dto);
	}

	/**
	 * /signin - sign in to API
	 */

	@Post('signin')
	signin(@Body() dto: SignInDto) {
		console.log(dto);
		return this.authService.signin(dto);
	}
}