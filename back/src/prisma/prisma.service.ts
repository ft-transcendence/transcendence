import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	[x: string]: any;
	private _message: any; //prismaClient is an existing class allowing to connect to a db, it has some basic functions already
	public get message(): any {
		return this._message;
	}
	public set message(value: any) {
		this._message = value;
	}
	constructor(config: ConfigService) {
		//from dotenv module
		super({
			//calls the constructor of the class being extended
			datasources: {
				db: {
					url: config.get('DATABASE_URL'),
				},
			},
		});
	}
}
