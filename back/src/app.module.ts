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
console.log('Using environment file: ' + environmentFilePath);
console.log('Using port: ' + process.env.PORT);

/*
 * This one is the main module, it will import all the others.
 */

@Module({
	imports: [
		ConfigModule.forRoot({
			// set path to .env file
			envFilePath: environmentFilePath,
			// global import
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		PrismaModule,
		ChatModule,
		GameModule,
	],
	providers: [GameService, GameGateway],
	// NOT USED AS OF YET
	// controllers: [AppController],
})
export class AppModule {}

console.log(`API URL: ` + process.env.MY_2FA_APP_NAME);
console.log(`API KEY: ` + process.env.FORTYTWO_SECRET);
console.log(`API UID: ` + process.env.FORTYTWO_ID);
console.log(`API CALLBACK: ` + process.env.FORTYTWO_CALLBACK);
