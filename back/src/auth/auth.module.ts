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

@Module({
	imports: [JwtModule.register({}), UserModule],
	controllers: [AuthController, TwoFAController],
	providers: [
		AuthService,
		TwoFactorService,
		jwtStrategy,
		RtStrategy,
		FortyTwoStrategy,
		UserService,
	],
})
export class AuthModule {}
