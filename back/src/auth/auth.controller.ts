
/**
 * AUTHENTIFICATION CONTROLLER
 */

/* GLOBAL MODULES */
import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
/* CUSTOM DECORATORS */
import { GetCurrentUser, GetCurrentUserId, Public } from "src/decorators";
/* INTERFACE FOR 42 API */
import { Profile_42 } from "./interfaces/42.interface";
/* AUTH MODULES */
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto } from "./dto"
import { FortyTwoAuthGuard } from "./guard/42auth.guard";
import { RtGuard } from "./guard";

// AUTH CONTROLLER - /auth
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	
	/**
	 * Testing basic /auth route 
	 */

	@Public()
	@Get('/')
	test_auth() {
		return this.authService.test_route();
	}

	/**
	 * Signin using 42 API => HREF front
	 */
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Get('42')
	signin_42() {
		console.log('42 API signin');
	}


	/**
	 * 42 Callback URI
	 */
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Get('42/callback')
	async callback_42(@Req() request: any, @Res() response: Response) {
		
		// Generate token using API response
		const token = await this.authService.signin_42(request.user as Profile_42);
		
		// SEND TOKEN TO FRONT in URL
		const url = new URL(`${request.protocol}:${request.hostname}`);
		url.port = process.env.FRONT_PORT;
		url.pathname = '/login';
		url.searchParams.append('access_token', token['access_token']);
		response.status(302).redirect(url.href);
	}

	/**
	 *	/signup - create account 
	 * @param dto data transfer object
	 */
	@Public()
	@Post('/signup')
	signup(@Body() dto: SignUpDto) {
		console.log(dto);
		return this.authService.signup(dto);
	}

	/**
	 * /signin - sign in to API
	 */
	@Public()
	@Post('/signin')
	signin(@Body() dto: SignInDto) {
		console.log(dto);
		return this.authService.signin(dto);
	}

	
	/**
	 * /logout - logout from API
	 */
	//@UseGuards(JwtGuard)
	@Post('logout')
	@HttpCode(200)
	logout(@GetCurrentUserId() userId: number) {
		console.log('logout', userId);
		return this.authService.signout(userId);
	}

	/* REFRESH TOKEN */
	@Public()
	@UseGuards(RtGuard)
	@HttpCode(200)
	@Post('/refresh')
	refresh(
		@GetCurrentUserId() userId: number, 
		@GetCurrentUser('refreshToken') refreshToken: string,
	) {
		console.log('refresh route id:' , userId, 'token:', refreshToken);
		return this.authService.refresh_token(userId, refreshToken);
	}
}