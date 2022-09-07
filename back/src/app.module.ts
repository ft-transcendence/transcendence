import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';

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
console.log('Using upload dir: ' + process.env.UPLOAD_DIR);

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
		MulterModule,
		AuthModule,
		GameModule,
		UserModule,
		PrismaModule,
		ChatModule,
		JwtModule.register({ secret: process.env.JWT_SECRET }),
		UploadModule,
	],
	providers: [AppGateway],
	exports: [AppGateway],
})
export class AppModule {}

console.log('API KEY: ' + process.env.FORTYTWO_SECRET);
console.log('API UID: ' + process.env.FORTYTWO_ID);
console.log('API CALLBACK: ' + process.env.FORTYTWO_CALLBACK);
console.log('2FA APP NAME: ' + process.env.MY_2FA_APP_NAME);
console.log('SITE URL: ' + process.env.SITE_URL);
