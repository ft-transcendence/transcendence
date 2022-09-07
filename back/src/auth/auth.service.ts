/* GLOBAL MODULES */
import { ForbiddenException, Injectable, Res } from '@nestjs/common';
/* PRISMA */
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
/* AUTH Modules */
import { Auth42Dto, AuthTokenDto, SignUpDto } from './dto';
import { SignInDto } from './dto';
/* Password Hash module */
import * as argon from 'argon2';
/* JASON WEB TOKEN */
import { JwtService } from '@nestjs/jwt';
/* USER Modules */
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { UploadService } from 'src/upload/upload.service';
import { AppGateway } from 'src/app.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';

/**
 * AUTHENTIFICATION SERVICE
 */
@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly appGateway: AppGateway,
		private readonly userService: UserService,
		private readonly chatGateway: ChatGateway,
		private readonly uploadService: UploadService,
	) {}

	/* SIGNUP */
	async signup(dto: SignUpDto): Promise<AuthTokenDto> {
		// destructure dto
		const { email, username, password } = dto;
		// hash password using argon2
		const hash = await argon.hash(password);
		// try to sign up using email
		try {
			const user = await this.userService.createUser(
				email,
				username,
				hash,
			);
			// return a hashed user
			const tokens = await this.signin_jwt(user.id, user.email);
			await this.updateRefreshToken(user.id, tokens.refresh_token);
			await this.uploadService.download_avatar(
				user.id,
				process.env.DEFAULT_AVATAR,
			);
			//sending status update to the front
			this.appGateway.onlineFromService(user.id);
			this.chatGateway.updateChannelRequest(
				'update channel request',
				'default_all',
			);

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
	async signin(dto: SignInDto): Promise<any> {
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
			return { username: user.username, twoFA: user.twoFA };
		}
		// generate token
		const tokens = await this.signin_jwt(user.id, user.email, user.twoFA);
		// update refresh token
		await this.updateRefreshToken(user.id, tokens.refresh_token);

		//sending status update to the front
		this.appGateway.onlineFromService(user.id);

		return tokens;
	}

	/* SIGNOUT */
	async signout(userId: number): Promise<void> {
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
		//sending status update to the front
		this.appGateway.offlineFromService(userId);
	}

	/* SIGNIN USING 42 API */
	async signin_42(dto: Auth42Dto): Promise<User> {
		// DTO
		const { id } = dto;
		// check if user exists
		const user = await this.prisma.user.findFirst({
			where: {
				id42: id,
			},
		});
		//sending status update to the front
		if (user) this.appGateway.onlineFromService(user.id);

		// if user does not exist, create it
		return user ?? this.create_42_user(dto);
	}

	async signin_42_token(
		@Res() response: Response,
		id: number,
		email: string,
	): Promise<Response> {
		// generate tokens
		const tokens = await this.signin_jwt(id, email);
		// update refresh token in DB
		await this.updateRefreshToken(id, tokens.refresh_token);
		// generate URL for token
		const url = new URL(process.env.SITE_URL);
		url.port = process.env.FRONT_PORT;
		url.pathname = '/auth';
		url.searchParams.append('access_token', tokens['access_token']);
		// send response to front
		response.status(302).redirect(url.href);
		return response;
	}

	async create_42_user(dto: Auth42Dto): Promise<User> {
		// DTO
		const { id, email, username, avatar } = dto;
		// generate random password
		const rdm_string = this.generate_random_password();
		// hash password using argon2
		const hash = await argon.hash(rdm_string);
		//create new user
		const user = await this.userService.createUser(
			email,
			username,
			hash,
			id,
		);

		if (user) {
			await this.uploadService.download_avatar(user.id, avatar);
		}
		//sending status update to the front
		this.appGateway.onlineFromService(user.id);
		// return token
		return user;
	}

	/* JWT */

	/* GENERATE JASON WEB TOKENS */
	async signin_jwt(
		userId: number,
		email: string,
		is2FA = false,
	): Promise<AuthTokenDto> {
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
	async refresh_token(
		userId: number,
		refreshToken: string,
	): Promise<AuthTokenDto> {
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
	async updateRefreshToken(
		userId: number,
		refreshToken: string,
	): Promise<void> {
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
	generate_random_password(): string {
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
