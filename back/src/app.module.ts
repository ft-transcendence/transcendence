import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameGateway } from './game/game.gateway';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

// Set the env file path
let envFilePath = '.env';

// Allows us to use environment variables

// Log
console.log(`Running in ` + process.env.ENVIRONMENT + ` mode`);

console.log(`Running on port ` + process.env.PORT );

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
  envFilePath = '.env.dev';
} else if (process.env.ENVIRONMENT === 'PRODUCTION') {
	envFilePath = '.env.prod';
}

/*
* This one is the main module, it will import all the others.
*/

@Module({
	imports: [	
				AuthModule, 
				UserModule, 
				PrismaModule,
				ChatModule,
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

console.log(`API KEY: ` + process.env.FORTYTWO_SECRET);
console.log(`API UID: ` + process.env.FORTYTWO_ID);
console.log(`API CALLBACK: ` + process.env.FORTYTWO_CALLBACK);