import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from '@prisma/client'		//turned into types by prisma
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

	test_route() {
		return { msg : 'This route is functional' };
	}

	async signup(dto: AuthDto) {

		const hash = await argon.hash(dto.password);
		try {
			const user = await this.prisma.user.create({ 
				data: { 
					email: dto.email,
					hash
			},
			});
			// temp security fix
			//delete user.hash;
			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials already exist')
				}
			}
		}
	}

	async signin(dto: AuthDto) {
		// find user
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		// if !unique throw error
		if (!user) throw new ForbiddenException(
			'Credentials incorrect'
			);
		const pwMatches = await argon.verify(user.hash, dto.password);
		if (!pwMatches) throw new ForbiddenException(
			'Invalid Credentials'
			);
		
		delete user.hash;
		return user;
	}   


}