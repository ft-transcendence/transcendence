import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameGateway } from './game/game.gateway';
import { ConfigModule } from '@nestjs/config';

require('dotenv').config();

let envFilePath = 'env.development';

console.log(`Running in ${process.env.ENVIRONMENT} mode`);

/*
* This one is the main module, it will import all the others.
*/

@Module({
	imports: [	
				AuthModule, 
				UserModule, 
				PrismaModule,
				ConfigModule.forRoot({
					// set path to .env file
					envFilePath,
					// global import
					isGlobal: true
				}),
			],
	providers: [GameGateway],
	
	// NOT USED AS OF YET
	// controllers: [AppController],
})

export class AppModule {}