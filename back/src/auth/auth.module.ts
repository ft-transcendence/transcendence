import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
/* JASON WEB TOKEN AUTH MODULE */
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategy';
import { RtStrategy } from './strategy/rt.strategy';
import { FortyTwoStrategy } from './strategy/42.strategy';
/* USER Module */
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

import { TwoFactorService } from './2FA/2fa.service';
import { TwoFAController } from './2FA/2fa.controller';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';
import { UploadService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		JwtModule.register({}),
		UserModule,
		GameModule,
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
	],
	exports: [AuthService],
})
export class AuthModule {}
