/* GLOBAL MODULES */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
/* AUTH PassportStrategy */
import { PassportStrategy } from '@nestjs/passport';
/* AUTH JWT */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';

/**
 * Creating a JWT strategy
 */

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	/**
	 * JWT strategy object constructor
	 */
	constructor(private prisma: PrismaService) {
		super({
			//jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			jwtFromRequest: ExtractJwt.fromExtractors([
				jwtStrategy.extractJwtFromCookie,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	/**
	 * Extract JWT from cookie
	 */
	private static extractJwtFromCookie(request: RequestType): string | null {
		const cookies = request.cookies;
		console.log(cookies.access_token);
		if (
			cookies &&
			cookies.access_token &&
			cookies.access_token.length > 0
		) {
			return cookies.access_token;
		}
		return undefined;
	}

	/**
	 * Validate function used by Passport Module
	 */
	async validate(data: { sub: number; email: string; istwoFA: boolean }) {
		// log in console
		console.log({
			data,
		});
		const user = await this.prisma.user.findUnique({
			where: {
				id: data.sub,
			},
		});
		// remove sensitive data
		if (user) delete user.hash;
		// if the user is not found user == NULL
		// 401 forbidden is returned.
		if (!user.twoFA) {
			return user;
		}
		if (data.istwoFA) {
			return user;
		}
	}
}
