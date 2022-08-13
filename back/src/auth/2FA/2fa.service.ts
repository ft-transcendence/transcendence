/* GLOBAL MODULES */
import {
	forwardRef,
	HttpStatus,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';
/* Decorators */
import { GetCurrentUserId } from 'src/decorators';
/* 2FA Modules */
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
/* DTOs */
import { TwoFactorDto, TwoFactorUserDto } from '../dto';

/**
 * TWO FACTOR AUTHENTICATION SERVICE
 */
@Injectable()
export class TwoFactorService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => AuthService))
		private authservice: AuthService,
	) {}

	/* Redirect 2FA Enabled signin */
	signin_2FA(response: Response, username: string) {
		const url = new URL(process.env.SITE_URL);
		url.port = process.env.FRONT_PORT;
		url.pathname = '2FA';
		url.searchParams.append('username', username);
		response.status(302).redirect(url.href);
		//response.end();
	}

	/* Turn on 2FA for existing user */
	async turn_on(twoFAcode: any, user: TwoFactorUserDto) {
		// destructure data
		const { email, twoFAsecret, id } = user;
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
		// console.log('turn_on_2fa', user, isValid);
		const tokens = await this.authservice.signin_jwt(id, email, true);
		return tokens;
	}

	/* Turn off 2FA for existing user */
	async turn_off(user: TwoFactorUserDto) {
		const { email, id } = user;
		await this.prisma.user.update({
			where: { id: id },
			data: { twoFA: false },
		});
		const tokens = await this.authservice.signin_jwt(id, email, false);
		return tokens;
	}

	/* Generate a new 2FA for user */
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

	/* Authenticate signin using 2FA */
	async authenticate(dto: TwoFactorDto) {
		// destructure dto
		const { username, twoFAcode } = dto;
		// find user by email or username
		const [user] = await this.prisma.user.findMany({
			where: { OR: [{ email: username }, { username: username }] },
		});
		// LOG
		//console.log(user);
		if (!user) {
			throw new UnauthorizedException('Invalid User');
		}
		// destructure data
		const { id, email, twoFAsecret } = user;
		// check if code is valid
		const isValidCode = await this.verify2FAcode(twoFAcode, twoFAsecret);
		// LOG
		//console.log('code is valid ?', isValidCode);
		// if invalid code, throw error
		if (!isValidCode) {
			throw new UnauthorizedException('Invalid 2FA code');
		}
		// generate tokens
		const tokens = await this.authservice.signin_jwt(id, email, true);
		return tokens;
	}

	/* Verify 2FA code */
	async verify2FAcode(code: string, twoFAsecret: string) {
		// LOG
		//console.log('verify2FAcode', code);
		//console.log('2FA Secret', twoFAsecret);
		return authenticator.verify({
			token: code,
			secret: twoFAsecret,
		});
	}

	/* Generate a QR code for the user */
	async generate2FAQRCode(onetimepathurl: string) {
		// Generate a QR code from the URL
		return toDataURL(onetimepathurl);
	}
}
