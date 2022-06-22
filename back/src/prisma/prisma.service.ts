import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {      //prismaClient is an existing class allowing to connect to a db, it has some basic functions already
	constructor(config: ConfigService) {               //from dotenv module
		super({                                        //calls the constructor of the class being extended
			datasources: {
				db: {
					url: config.get('DATABASE_URL')
				}
			}
		})
	}
}