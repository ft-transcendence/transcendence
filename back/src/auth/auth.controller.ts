
/**
 * AUTHENTIFICATION CONTROLLER
 */

/* GLOBAL MODULES */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { stringify } from "querystring";
/* AUTH MODULES */
import { AuthService } from "./auth.service";

import { SignUpDto } from "./dto"
import { SignInDto } from "./dto"
import { Auth42Dto } from "./dto"
import { FortyTwoAuthGuard } from "./guard/42auth.guard";

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
	 * Signin using 42 API
	 */
	@UseGuards(FortyTwoAuthGuard)
	@Get('42')
	async signin_42(@Req() req: any, @Res() response: Response) : Promise<void> {
		// LOG REQUEST
		console.log(response);
		
		const token = await this.authService.signin_jwt(req.user.id, req.user.email);

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = process.env.FRONT_PORT;
		url.pathname = 'login';
		url.searchParams.set('code', stringify(token));

		response.status(302).send(url.href);
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