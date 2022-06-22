import { Injectable } from "@nestjs/common";
import { User } from '@prisma/client'		//turned into types by prisma
import { PrismaService } from "src/prisma/prisma.service";

/**
 * AUTHENTIFICATION SERVICE
 */
@Injectable()
export class AuthService{
	constructor(private prisma: PrismaService) {}

	test_route() {
		return { msg : 'This route is functional' };
	}

	signup() {
		return { msg : 'I am signing up'};
		
	}	
	
	login() {
		return { msg : 'I am signing in'};
	}   


}