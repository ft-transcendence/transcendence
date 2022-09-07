/**
 * Creating 42 API Auth strategy
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

import { Profile_42 } from '../interfaces/42.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42auth') {
	/**
	 * 42 API Auth strategy object constructor
	 */
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.FORTYTWO_ID,
			clientSecret: process.env.FORTYTWO_SECRET,
			callbackURL: process.env.FORTYTWO_CALLBACK,
			profileFields: {
				id: 'id',
				username: 'login',
				email: 'email',
				avatar: 'image_url',
			},
		});
	}

	validate(accessToken: string, refreshToken: string, profile: Profile_42) {
		return profile;
	}
}
