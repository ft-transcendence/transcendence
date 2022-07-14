
/**
 * AUTHENTIFICATION CONTROLLER
 */

/* GLOBAL MODULES */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { stringify } from "querystring";
//import { Response } from "@nestjs/common";
import { Public } from "src/decorators";
/* AUTH MODULES */
import { AuthService } from "./auth.service";

import { SignUpDto } from "./dto"
import { SignInDto } from "./dto"
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
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Get('42')
	async signin_42(@Req() request: any, @Res() response: Response) {
		
		const token = await this.authService.signin_42(request, response);

		const url = new URL(`${request.protocol}:${request.hostname}`);
		url.port = process.env.FRONT_PORT;
		url.pathname = '/';
		url.searchParams.set('token', stringify(token));

		response.status(302).send(url.href);	
	}

	/**
	 *	/signup - create account 
	 * @param dto data transfer object
	 */
	@Public()
	@Post('signup')
	signup(@Body() dto: SignUpDto) {
		console.log(dto);
		return this.authService.signup(dto);
	}

	/**
	 * /signin - sign in to API
	 */
	@Public()
	@Post('signin')
	signin(@Body() dto: SignInDto) {
		console.log(dto);
		return this.authService.signin(dto);
	}
}