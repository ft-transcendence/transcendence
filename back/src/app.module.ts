import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameGateway } from './game/game.gateway';
import { ConfigModule } from '@nestjs/config';

// Allows us to use environment variables
require('dotenv').config();

// Set the env file path
let envFilePath = '.env.development';

// Log
console.log(`Running in ` + process.env.ENVIRONMENT + ` mode`);
console.log(`Running on port ` + process.env.PORT );

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