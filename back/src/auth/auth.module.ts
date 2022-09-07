import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
/* JASON WEB TOKEN AUTH MODULE */
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy, RtStrategy, FortyTwoStrategy } from './strategy';
/* USER Module */
import { forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TwoFAController, TwoFactorService } from './2FA';
import { UploadModule } from 'src/upload/upload.module';
import { HttpModule } from '@nestjs/axios';
import { ChatModule } from 'src/chat/chat.module';
import { AppModule } from 'src/app.module';

@Module({
	imports: [
		JwtModule.register({}),
		forwardRef(() => AppModule),
		forwardRef(() => UserModule),
		forwardRef(() => ChatModule),
		forwardRef(() => UploadModule),
		forwardRef(() => HttpModule),
	],
	controllers: [AuthController, TwoFAController],
	providers: [
		AuthService,
		TwoFactorService,
		jwtStrategy,
		RtStrategy,
		FortyTwoStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {}
