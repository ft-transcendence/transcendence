/* GLOBAL MODULES */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
/* AUTH PassportStrategy */
import { PassportStrategy } from '@nestjs/passport';
/* AUTH JWT */
import { ExtractJwt, Strategy } from 'passport-jwt';

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
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	/**
	 * Validate function used by Passport Module
	 */
	async validate(data: { sub: number; email: string; is2FA: boolean }) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: data.sub,
			},
		});
		// if user is logged out return 401
		if (!user.hashedRtoken) return;
		// remove sensitive data
		if (user) delete user.hash;
		// if the user is not found user == NULL
		// 401 forbidden is returned.
		if (!user.twoFA) {
			return user;
		}
		if (data.is2FA) {
			return user;
		}
	}
}
