import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/decorators';
import { TwoFactorDto, TwoFactorUserDto } from '../dto';
import { TwoFactorService } from './2fa.service';
import { Response } from 'express';

@Controller('/auth/2fa')
export class TwoFAController {
	constructor(private twoFAservice: TwoFactorService) {}

	/* TWO FACTOR AUTHENTIFICATION */

	/**
	 * /2FA/turn-on - turn on 2FA
	 */
	@Post('/turn-on')
	@HttpCode(200)
	async turn_on(
		@Body() { twoFAcode }: any,
		@GetCurrentUser() user: TwoFactorUserDto,
	) {
		const tokens = await this.twoFAservice.turn_on(twoFAcode, user);
		return tokens;
	}

	/**
	 * /2FA/turn-off - turn off 2FA
	 */
	@Post('/turn-off')
	@HttpCode(200)
	async turn_off(@GetCurrentUser() user: TwoFactorUserDto) {
		const tokens = await this.twoFAservice.turn_off(user);
		return tokens;
	}

	/**
	 * /2fa/authenticate - authenticate 2FA
	 */
	@Public()
	@Post('/authenticate')
	async authenticate(@Body() dto: TwoFactorDto) {
		// LOG
		//console.log('auth 2fa', dto);
		return this.twoFAservice.authenticate(dto);
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
