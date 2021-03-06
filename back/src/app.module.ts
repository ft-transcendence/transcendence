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
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { AppGateway } from './app.gateway';
import { ChatService } from './chat/chat.service';

// Set the env file path
let envFilePath = '.env';

if (process.env.ENVIRONMENT === 'PRODUCTION') {
	envFilePath = '.env.prod';
} else if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
	envFilePath = '.env.dev';
}

// Log
console.log(`Running in ` + process.env.ENVIRONMENT + ` mode`);
console.log(`Running on port ` + process.env.PORT );

/*
* This one is the main module, it will import all the others.
*/

@Module({
	imports: 
	[	
		AuthModule, 
		UserModule, 
		PrismaModule,
		ChatModule,
		GameModule,
		ConfigModule.forRoot({
			// set path to .env file
			envFilePath,
			// global import
			isGlobal: true
		}),
		JwtModule.register({secret: process.env.JWT_SECRET}),
	],
	providers: [GameService, GameGateway, UserService, AppGateway, ChatService],		
	// NOT USED AS OF YET
	// controllers: [AppController],

})

export class AppModule {}

console.log(`API KEY: ` + process.env.FORTYTWO_SECRET);
console.log(`API UID: ` + process.env.FORTYTWO_ID);
console.log(`API CALLBACK: ` + process.env.FORTYTWO_CALLBACK);