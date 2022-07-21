import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { GameGateway } from './game/game.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

// Set the env file path
let environmentFilePath = '.env';

if (process.env.ENVIRONMENT === 'PRODUCTION') {
	environmentFilePath = '.env.prod';
} else if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
	environmentFilePath = '.env.dev';
}

// Log
console.log(`Running in ` + process.env.ENVIRONMENT + ` mode`);
console.log(`Running on port ` + process.env.PORT);

/*
 * This one is the main module, it will import all the others.
 */

@Module({
	imports: [
		AuthModule,
		UserModule,
		PrismaModule,
		ChatModule,
		GameModule,
		ConfigModule.forRoot({
			// set path to .env file
			envFilePath: environmentFilePath,
			// global import
			isGlobal: true,
		}),
	],
	providers: [GameService, GameGateway],
	// NOT USED AS OF YET
	// controllers: [AppController],
})
export class AppModule {}

console.log(`API KEY: ` + process.env.FORTYTWO_SECRET);
console.log(`API UID: ` + process.env.FORTYTWO_ID);
console.log(`API CALLBACK: ` + process.env.FORTYTWO_CALLBACK);
