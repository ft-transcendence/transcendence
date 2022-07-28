/**
 * AUTHENTIFICATION CONTROLLER
 */

/* GLOBAL MODULES */
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
/* CUSTOM DECORATORS */
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/decorators';
/* INTERFACE FOR 42 API */
import { Profile_42 } from './interfaces/42.interface';
/* AUTH MODULES */
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guard';
import { RtGuard } from './guard';
/* AUTH DTOs */
import { SignUpDto, SignInDto } from './dto';

// AUTH CONTROLLER - /auth
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	/**
	 *	/signup - create account
	 * Creates a new user email/username/password
	 */
	@Public()
	@Post('/signup')
	signup(@Body() dto: SignUpDto) {
		console.log(dto);
		return this.authService.signup(dto);
	}

	/**
	 * /signin - sign in to API
	 * Signs an existing user email/username and password
	 */
	@Public()
	@Post('/signin')
	signin(@Body() dto: SignInDto, @Res() response: Response) {
		console.log(dto);
		return this.authService.signin(dto, response);
	}

	/**
	 * /logout - logout from API
	 * Deletes the refresh token from the database
	 */
	@Post('logout')
	@HttpCode(200)
	logout(@GetCurrentUserId() userId: number) {
		// LOG
		console.log('logout', userId);
		return this.authService.signout(userId);
	}

	/* 42 API  */

	/**
	 * Signin using 42 API => HREF front
	 * Work in progress
	 */
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Get('42')
	signin_42() {
		console.log('42 API signin');
	}

	/**
	 * 42 Callback URI
	 * Creates user or signin if user already exists
	 */
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Get('42/callback')
	async callback_42(@Req() request: any, @Res() response: Response) {
		// Generate token using API response
		const tokens = await this.authService.signin_42(
			request.user as Profile_42,
			response,
		);

		// SEND TOKEN TO FRONT in URL
		const url = new URL(`${request.protocol}` + '://localhost');
		url.port = process.env.FRONT_PORT;
		url.pathname = '/auth';
		url.searchParams.append('access_token', tokens['access_token']);
		response.status(302).redirect(url.href);

		// SEND TOKEN TO FRONT
		//console.log('callback_42', tokens);
		//return response.status(201).send(tokens['access_token']);
		//return tokens['access_token'];
	}

	/* REFRESH TOKEN CALLBACK */

	/**
	 *	Updates Tokens for signed in user
	 *	Work in progress
	 */
	@Public()
	@UseGuards(RtGuard)
	@HttpCode(200)
	@Post('/refresh')
	refresh(
		@GetCurrentUserId() userId: number,
		@GetCurrentUser('refreshToken') refreshToken: string,
	) {
		console.log('refresh route id:', userId, 'token:', refreshToken);
		return this.authService.refresh_token(userId, refreshToken);
	}

	/**
	 * Testing basic /auth route
	 */
	@Public()
	@Get('/')
	test_auth() {
		return this.authService.test_route();
	}
}
