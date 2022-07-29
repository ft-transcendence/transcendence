import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UnauthorizedException,
} from '@nestjs/common';
import { GetCurrentUser, Public } from 'src/decorators';
import { TwoFactorUserDto } from '../dto';
import { TwoFactorService } from './2fa.service';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Controller('/auth/2fa')
export class TwoFAController {
	constructor(
		private twoFAservice: TwoFactorService,
		private prisma: PrismaService,
		private authService: AuthService,
	) {}
	/* TWO FACTOR AUTHENTIFICATION */

	/**
	 * /2FA/turn-on - turn on 2FA
	 */
	@Post('/turn-on')
	@HttpCode(200)
	async turn_on_2fa(
		@Body() { twoFAcode }: any,
		@GetCurrentUser() user: TwoFactorUserDto,
	) {
		await this.twoFAservice.turn_on_2fa(twoFAcode, user);
		return {
			success: ' 2FA turned on',
		};
	}

	/**
	 * /2fa/authenticate - authenticate 2FA
	 */
	@Public()
	@Post('/authenticate')
	async authenticate_2fa(
		@Body() { twoFAcode, user }: any, //@GetCurrentUser() user: TwoFactorUserDto,
	) {
		console.log(twoFAcode, user);
		// destructure data
		const current_user = await this.prisma.user.findUnique({
			where: {
				email: user,
			},
		});
		const { email, id, twoFAsecret } = current_user;
		// check if code is valid
		const isValidCode = this.twoFAservice.verify2FAcode(
			twoFAcode,
			twoFAsecret,
		);
		// if invalid code, throw error
		if (!isValidCode) {
			throw new UnauthorizedException('Invalid 2FA code');
		}
		// return
		return this.authService.signin_jwt(id, email, true);
	}

	/**
	 * /2fa/generate - generate a new 2FA QR code
	 */
	@Post('/generate')
	async generate_2fa(
		@Res() response: Response,
		@GetCurrentUser('email') email: string,
	) {
		const { onetimepathurl } = await this.twoFAservice.generate2FA(email);
		const qrcode = await this.twoFAservice.generate2FAQRCode(
			onetimepathurl,
		);
		return response.json(qrcode);
	}
}
