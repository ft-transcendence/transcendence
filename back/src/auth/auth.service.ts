import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from '@prisma/client'		//turned into types by prisma
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { domainToASCII } from "url";
import { AuthDto } from "./dto";

/* Providers, or services, are responsible for executing the business logic, the execution, the DOING stuff :
*  they can be injected as a dependency, meaning objects can create various relationships with each other
*/


@Injectable()
export class AuthService{
	constructor(private prisma: PrismaService) {}		//the PrismaService is injectable, meaning this instantiates it into the prisma var

	async signup(dto: AuthDto) {								//receiving the dto makes it sure that the data is correct				

		const hash = dto.password;
		try 
		{	
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash,

				},
			});

			delete user.hash;								//removing hash from user to return
			return user;
			return { msg : 'I have signed up'};
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')	{				//duplicate field (double email)
					throw new ForbiddenException('Credentials taken');
				}
				throw error;
			}
		}
	}


	async signin(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({		//find user from email
			where: {
				email: dto.email,
			},
		});

		if (!user)
			throw new ForbiddenException('Credentials incorrect');

		const pwMatches = (user.hash === dto.password);
		
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');

		delete user.hash;
		return user;
		return { msg : 'I am signed in'};
	}   

}

// const service = new AuthService()         //instantiating the service to be usable by the controller, but useless since this is injectable