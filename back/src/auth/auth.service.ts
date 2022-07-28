/* GLOBAL MODULES */
import { ForbiddenException, Injectable } from '@nestjs/common';
/* PRISMA */
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
/* AUTH Modules */
import { Auth42Dto, SignUpDto } from './dto';
import { SignInDto } from './dto';
/* Password Hash module */
import * as argon from 'argon2';
/* JASON WEB TOKEN */
import { JwtService } from '@nestjs/jwt';
/* USER Modules */
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

/**
 * AUTHENTIFICATION SERVICE
 */
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	/* SIGNUP */
	async signup(dto: SignUpDto) {
		// destructure dto
		const { email, username, password } = dto;
		// hash password using argon2
		const hash = await argon.hash(password);
		// try to sign up using email
		try {
			const user = await this.prisma.user.create({
				data: {
					email: email,
					username: username,
					hash,
				},
			});
			// return a hashed user
			const tokens = await this.signin_jwt(user.id, user.email);
			await this.updateRefreshToken(user.id, tokens.refresh_token);
			return tokens;
		} catch (error) {
			// duplicate user email
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ForbiddenException('Credentials already exist');
			}
		}
	}

	/* SIGNIN */
	async signin(dto: SignInDto, response: Response) {
		// destructure dto (rafa tips :D)
		const { username, password } = dto;
		// find user
		const [user] = await this.prisma.user.findMany({
			where: { OR: [{ email: username }, { username: username }] },
		});
		// if !unique throw error
		if (!user) {
			throw new ForbiddenException('Invalid Credentials');
		}
		const pwMatches = await argon.verify(user.hash, password);
		// Invalid password
		if (!pwMatches) {
			throw new ForbiddenException('Invalid Credentials');
		}
		if (user.twoFA) {
			//throw new ForbiddenException('TwoFA is enabled');
			response
				.status(200)
				.redirect('http://localhost:3000/2FA/authenticate');
			return response;
		}
		// generate token
		const tokens = await this.signin_jwt(user.id, user.email, user.twoFA);
		// update refresh token
		await this.updateRefreshToken(user.id, tokens.refresh_token);

		return tokens;
	}

	/* SIGNOUT */
	async signout(userId: number) {
		// delete refresh token (log out)
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRtoken: {
					// eslint-disable-next-line unicorn/no-null
					not: null,
				},
			},
			data: {
				// eslint-disable-next-line unicorn/no-null
				hashedRtoken: null,
			},
		});
	}

	/* SIGNIN USING 42 API */
	async signin_42(dto: Auth42Dto, response: Response) {
		// LOG
		console.log('signin_42');
		// DTO
		const { email, username, avatar } = dto;
		// check if user exists
		const user = await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		// if user does not exist, create it
		if (!user) {
			// generate random password
			const rdm_string = this.generate_random_password();
			// LOG generate random password
			console.log(rdm_string);
			// hash password using argon2
			const hash = await argon.hash(rdm_string);
			//create new user
			const new_user = await this.userService.createUser(
				email,
				username,
				hash,
			);
			if (new_user) {
				await this.userService.updateAvatar(new_user.id, avatar);
			}
			// LOG
			console.log('create user :', username, email, rdm_string);
			// return token
			return await this.signin_jwt(new_user.id, email);
		} else {
			// LOG
			console.log('user exists');
			// check if 2FA is enabled
			if (user.twoFA) {
				return await this.signin_2FA(response, user);
				//throw new ForbiddenException('TwoFA is enabled');
			}
			// return token
			const tokens = await this.signin_jwt(user.id, email);
			return {
				twoFA: false,
				tokens: tokens,
			};
		}
	}

	/* 2FA Enabled signin */
	async signin_2FA(response: Response, user: Auth42Dto) {
		const url = new URL('http://localhost');
		url.port = process.env.FRONT_PORT;
		url.pathname = '/auth/authenticate';
		url.searchParams.append('email', user.email);
		response.status(302).redirect(url.href);
		return {
			twoFA: true,
			response,
		};
	}

	/* JWT */

	/* GENERATE JASON WEB TOKENS */
	async signin_jwt(
		userId: number,
		email: string,
		is2FA = false,
	): Promise<{ access_token: string; refresh_token: string }> {
		// get login data
		const login_data = {
			sub: userId,
			email,
			is2FA,
		};
		// generate jwt secret
		const secret = process.env.JWT_SECRET;
		// Set expiration times
		const access_token_expiration = process.env.ACCESS_TOKEN_EXPIRATION;
		const refresh_token_expiration = process.env.REFRESH_TOKEN_EXPIRATION;

		// set Auth Token params
		const Atoken = await this.jwtService.signAsync(login_data, {
			expiresIn: access_token_expiration,
			secret: secret,
		});
		// set Refresh Token params
		const Rtoken = await this.jwtService.signAsync(login_data, {
			expiresIn: refresh_token_expiration,
			secret: secret,
		});
		// return tokens
		return {
			access_token: Atoken,
			refresh_token: Rtoken,
		};
	}

	/* REFRESH TOKEN */
	async refresh_token(userId: number, refreshToken: string) {
		// Find user by id
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		// Check if user exists and is logged in
		if (!user || !user.hashedRtoken)
			// throw 403 error
			throw new ForbiddenException('Invalid Credentials');
		// Verify hashed Refresh Token
		const pwMatches = await argon.verify(user.hashedRtoken, refreshToken);
		// Invalid refresh token
		if (!pwMatches)
			// throw 403 error
			throw new ForbiddenException('Invalid Credentials');
		// Generate new tokens
		const tokens = await this.signin_jwt(user.id, user.email);
		// Update Refresh Token - if user is logged in and valid
		await this.updateRefreshToken(user.id, tokens.refresh_token);
		// return tokens
		return tokens;
	}

	/* UPDATE REFRESH TOKEN */
	async updateRefreshToken(userId: number, refreshToken: string) {
		// hash refresh token
		const hash = await argon.hash(refreshToken);
		// update user refresh token (log in)
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hashedRtoken: hash,
			},
		});
	}

	/* AUTH SERVICE UTILS */

	/* GENERATE A RANDOM PASSWORD */
	generate_random_password() {
		// generate random password for 42 User
		const password =
			Math.random().toString(36).slice(2, 15) +
			Math.random().toString(36).slice(2, 15);
		return password;
	}

	/* TESTING */

	// basic test route
	test_route() {
		return { msg: 'This route is functional' };
	}
}
