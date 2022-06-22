import { Body, Controller, Get, Post } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto"

/**
 * AUTHENTIFICATION CONTROLLER
 */

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
	signup(@Body() dto: any) {
		console.log(dto);
		return this.authService.signup();
	}

	/**
	 * /login - sign in to API
	 */

	@Post('login')
	login(@Body() dto: AuthDto) {
		console.log(dto);
		return this.authService.login();
	}
}