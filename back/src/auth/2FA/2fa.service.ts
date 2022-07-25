/* GLOBAL MODULES */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';
/* Decorators */
import { GetCurrentUserId } from 'src/decorators';
/* 2FA Modules */
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
/* DTOs */
import { TwoFactorUserDto } from '../dto';

/**
 * TWO FACTOR AUTHENTICATION SERVICE
 */
@Injectable()
export class TwoFactorService {
	constructor(
		private prisma: PrismaService,
		private authservice: AuthService,
	) {}

	// Turn on 2FA for existing user
	async turn_on_2fa(twoFAcode: any, user: TwoFactorUserDto) {
		// destructure data
		const { email, twoFAsecret } = user;
		// Check is 2FA code is valid
		const isValid = await this.verify2FAcode(twoFAcode, twoFAsecret);
		// If invalid, throw error 401
		if (!isValid) throw new UnauthorizedException('Invalid 2FA code');
		// Enable 2FA for user (add method to user module ?)
		await this.prisma.user.update({
			where: { email: email },
			data: { twoFA: true },
		});
		// LOG
		console.log('turn_on_2fa', user, isValid);
	}

	// Turn off 2FA for existing user
	async turn_off_2fa(@GetCurrentUserId() userId: number) {
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFA: false },
		});
	}

	// Generate a new 2FA fur user
	async generate2FA(email: string) {
		// Generate a 2FA secret
		const secret = authenticator.generateSecret();
		// Create a URL for the QR code
		const onetimepathurl = authenticator.keyuri(
			email,
			process.env.MY_2FA_APP_NAME,
			secret,
		);
		// Add the secret to the user
		await this.prisma.user.update({
			where: { email: email },
			data: { twoFAsecret: secret },
		});
		// LOG
		//console.log('gen2FA', secret, onetimepathurl);
		return {
			secret,
			onetimepathurl,
		};
	}

	async login_with_2fa(user: TwoFactorUserDto) {
		// destructure data
		const { email, userId } = user;
		return {
			id: userId,
			tokens: this.authservice.signin_jwt(userId, email, true),
		};
	}

	// Verify 2FA code
	async verify2FAcode(code: string, twoFAsecret: string) {
		return authenticator.verify({
			token: code,
			secret: twoFAsecret,
		});
	}

	// Generate a QR code for the user
	async generate2FAQRCode(onetimepathurl: string) {
		// Generate a QR code from the URL
		return toDataURL(onetimepathurl);
	}
}
