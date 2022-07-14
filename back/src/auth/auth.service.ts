/* GLOBAL MODULES */
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
/* PRISMA */
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
/* AUTH Modules */
import { SignUpDto } from './dto'
import { SignInDto } from './dto'
/* Password Hash module */
import * as argon from 'argon2'
/* JASON WEB TOKEN */
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
/* USER Modules */
import { UserService } from "src/user/user.service";

/**
 * AUTHENTIFICATION SERVICE
 */
@Injectable()
export class AuthService{
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
		private userService: UserService,
		) {} 

	// basic test route
	test_route() {
		return { msg : 'This route is functional' };
	}

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
					hash
			},
			});
			// return a hashed user
			return this.signin_jwt(user.id, user.email);
		} catch (error) {
		// duplicate user email
			if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
					throw new ForbiddenException('Credentials already exist')
				}
		}
	}

	/* SIGNIN */
	async signin(dto: SignInDto) {
		// destructure dto (rafa tips :D)
		const { username, password } = dto;
		// find user
		const [user] = await this.prisma.user.findMany({
			where: { OR: [{ email : username } , { username : username }] },
		});
		// if !unique throw error
		if (!user) throw new ForbiddenException(
			'Invalid Credentials'
			);
		
		const pwMatches = await argon.verify(user.hash, password);
		// Invalid password
		if (!pwMatches) throw new ForbiddenException(
			'Invalid Credentials'
			);
		return this.signin_jwt(user.id, user.email);
	}

	/* SIGNIN JASON WEB TOKEN */
	async signin_jwt(
		userId: number,
		email: string,
		): Promise<{access_token : string}> {
		// get login data
		const login_data = {
			sub: userId,
			email
		}
		// generate jwt secret
		const secret = this.config.get('JWT_SECRET');
		// set JWT params (basic)
		const token = await this.jwtService.signAsync(login_data, {
			expiresIn: '15m',
			secret: secret,});
		// return token
		return {
			access_token: token,
		};
	}

	/* SIGNOUT */

	/* GENERATE A RADNOM PASSWORD */
	generate_random_password() {
		const password = Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
		return password;
	}

	/* SIGNIN USING 42 API */
	async signin_42(request: any, response: Response) {
		console.log('signin_42');
		console.log(request.user.emails[0].value);
		//console.log(request);
		//console.log(response);
		// check if user exists
		
		const user = await this.prisma.user.findUnique({
			where: { 
				email: request.user.emails[0].value,
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
			const new_user = await this.userService.createUser(request.user.emails[0].value, request.user.username, hash);
			// return new user token
			return this.signin_jwt(new_user.id, new_user.email);
		}
		else
		{
			// LOG
			console.log('user exists');
			// return token
			return this.signin_jwt(user.id, user.email);
		}
	}
}