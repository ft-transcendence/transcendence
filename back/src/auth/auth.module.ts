import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
/* JASON WEB TOKEN AUTH MODULE */
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy, RtStrategy, FortyTwoStrategy } from './strategy';
/* USER Module */
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

import { TwoFAController, TwoFactorService } from './2FA';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';
import { UploadService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';
import { HttpModule } from '@nestjs/axios';
import { AppGateway } from 'src/app.gateway';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	imports: [
		JwtModule.register({}),
		UserModule,
		GameModule,
		ChatModule,
		UploadModule,
		HttpModule,
	],
	controllers: [AuthController, TwoFAController],
	providers: [
		AuthService,
		TwoFactorService,
		jwtStrategy,
		RtStrategy,
		FortyTwoStrategy,
		UserService,
		GameService,
		UploadService,
		AppGateway,
	],
	exports: [AuthService],
})
export class AuthModule {}
