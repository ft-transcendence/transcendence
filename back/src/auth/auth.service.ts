/* GLOBAL MODULES */
import { ForbiddenException, Injectable } from "@nestjs/common";
/* PRISMA */
import { PrismaService } from "src/prisma/prisma.service";
/* AUTH Modules */
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

/**
 * AUTHENTIFICATION SERVICE
 */
@Injectable()
export class AuthService{
	constructor(private prisma: PrismaService) {}

	// basic test route
	test_route() {
		return { msg : 'This route is functional' };
	}

	/* SIGNUP */
	async signup(dto: AuthDto) {

		// hash password using argon2
		const hash = await argon.hash(dto.password);
		// try to sign up using email
		try {
			const user = await this.prisma.user.create({ 
				data: { 
					email: dto.email,
					hash
			},
			});

			// temp security fix
			delete user.hash;
			return user;
		} catch (error) {
		// duplicate user email
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials already exist')
				}
			}
		}
	}

	/* SIGNIN */
	async signin(dto: AuthDto) {
		// find user
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		// if !unique throw error
		if (!user) throw new ForbiddenException(
			'Invalid Credentials'
			);
		
		const pwMatches = await argon.verify(user.hash, dto.password);
		// Invalid password
		if (!pwMatches) throw new ForbiddenException(
			'Invalid Credentials'
			);
		
		// temp security fix
		delete user.hash;
		return user;
	}
}