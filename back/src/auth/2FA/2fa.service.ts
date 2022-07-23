import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { GetCurrentUserId } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL, toFileStream } from 'qrcode';
import { TwoFactorDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

/**
 * TWO FACTOR AUTHENTICATION SERVICE
 */
@Injectable()
export class TwoFactorService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	// Turn on 2FA for existing user
	async turn_on_2fa(dto: TwoFactorDto, otp: string) {
		// destructure data
		const { email, twoFAcode } = dto;
		// Check is 2FA code is valid
		const isValid = await this.verify2FAcode(twoFAcode, otp);
		// If invalid, throw error 401
		if (!isValid) throw new UnauthorizedException('Invalid 2FA code');
		// Enable 2FA for user (add method to user module ?)
		await this.prisma.user.update({
			where: { email: email },
			data: { twoFA: true },
		});
		// LOG
		console.log('turn_on_2fa', dto, isValid);
	}

	// Turn off 2FA for existing user
	async turn_off_2fa(@GetCurrentUserId() userId: number) {
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFA: false },
		});
	}

	// Generate a new 2FA fur user
	async generate2FA(user: TwoFactorDto) {
		// destructure data
		const { email } = user;
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

	async login_with_2fa(user: any) {
		const data = {
			id: user.id,
			email: user.email,
			istwoFA: true,
		};
		return {
			id: user.id,
			access_token: this.jwtService.sign(data),
		};
	}

	// Verify 2FA code
	async verify2FAcode(otp: string, onetimepathurl: string) {
		return authenticator.verify({
			token: onetimepathurl,
			secret: otp,
		});
	}

	// Generate a QR code for the user
	async generate2FAQRCode(onetimepathurl: string) {
		// Generate a QR code from the URL
		return toDataURL(onetimepathurl);
	}
}
