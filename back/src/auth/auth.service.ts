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
		// hash password using argon2
		const hash = await argon.hash(dto.password);
		// try to sign up using email
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					username: dto.username,
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
	async signin(dto: SignInDto) {
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
	async signin_42(dto: Auth42Dto) {
		// LOG
		console.log('signin_42');

		// DTO
		const { email, username /*, avatar */ } = dto;
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
			// LOG
			console.log('create user :', username, email, rdm_string);
			// return token
			return this.signin_jwt(new_user.id, email);
		} else {
			// LOG
			console.log('user exists');
			// return token
			return this.signin_jwt(user.id, user.email);
		}
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
		// set Auth Token params
		const Atoken = await this.jwtService.signAsync(login_data, {
			expiresIn: '10m',
			secret: secret,
		});
		// set Refresh Token params
		const Rtoken = await this.jwtService.signAsync(login_data, {
			expiresIn: '60m',
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
