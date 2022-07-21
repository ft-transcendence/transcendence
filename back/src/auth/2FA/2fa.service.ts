import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { GetCurrentUser } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL } from 'qrcode';
import { TwoFactorDto } from '../dto';

/**
 * TWO FACTOR AUTHENTICATION SERVICE
 */
@Injectable()
export class TwoFactorService {
	constructor(private prisma: PrismaService) {}

	async generate2FA(@GetCurrentUser() user) {
		const secret = authenticator.generateSecret();
		const onetimepathurl = authenticator.keyuri(
			user.email,
			'TEST_APP',
			secret,
		);
		await this.prisma.user.update({
			where: { email: user.email },
			data: { onetimepathurl: secret },
		});
		return {
			secret,
			onetimepathurl,
		};
	}

	async generate2FAQRCode(onetimepathurl: string) {
		return toDataURL(onetimepathurl);
	}

	async turn_on_2fa(dto: TwoFactorDto, otp: string) {
		const { userId, twoFAcode } = dto;
		const isValid = await this.verify2FA(twoFAcode, otp);
		if (!isValid) {
			throw new UnauthorizedException('Invalid 2FA code');
		}
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFA: true },
		});
	}

	async turn_off_2fa(@GetCurrentUser() user) {
		await this.prisma.user.update({
			where: { id: user.id },
			data: { twoFA: false },
		});
	}

	async verify2FA(otp: string, onetimepathurl: string) {
		return authenticator.verify({
			token: onetimepathurl,
			secret: otp,
		});
	}
}
