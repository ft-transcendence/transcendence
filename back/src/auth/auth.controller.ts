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
	UseFilters,
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
import { TwoFactorService } from './2FA/2fa.service';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ViewAuthFilter } from './filter';

// AUTH CONTROLLER - /auth
@ApiTags('authentification')
@ApiHeader({
	name: 'Authorization',
	description: 'Jason Web Token as Bearer Token',
})
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private twoFAService: TwoFactorService,
	) {}

	/**
	 *	/signup - create account
	 * Creates a new user email/username/password
	 */
	@Public()
	@ApiResponse({ status: 403, description: 'Credentials already exist' })
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
	@ApiResponse({ status: 403, description: 'Invalid Credentials' })
	@Post('/signin')
	signin(@Body() dto: SignInDto) {
		console.log(dto);
		return this.authService.signin(dto);
	}

	/**
	 * /logout - logout from API
	 * Deletes the refresh token from the database
	 */
	@Post('logout')
	@HttpCode(200)
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	logout(@GetCurrentUserId() userId: number) {
		// LOG
		console.log('logout', userId);
		return this.authService.signout(userId);
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
	@UseFilters(ViewAuthFilter)
	@Get('42/callback')
	async callback_42(@Req() request: any, @Res() response: Response) {
		console.log('test');
		// Generate token using API response
		const user = await this.authService.signin_42(
			request.user as Profile_42,
		);
		const { username, twoFA, id, email } = user;
		// LOG
		console.log('42 API signin', username, twoFA);
		return twoFA
			? this.twoFAService.signin_2FA(response, username)
			: this.authService.signin_42_token(response, id, email);
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
