/* GLOBAL MODULES */
import { Injectable } from '@nestjs/common';
/* AUTH Passport Module */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
/* REQUEST */
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			// Extract Token from header - Authorization: Bearer <token>
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
			// Pass request to callback function
			passReqToCallback: true,
		});
	}
	// Validate function used by Passport Module
	async validate(request: Request, data: any) {
		// switch Token to refresh Token
		const refreshToken = request
			.get('authorization')
			.replace('Bearer ', '')
			.trim();

		// LOG IN CONSOLE
		// console.log(data);

		// return data and append refreshToken
		return {
			...data,
			refreshToken,
		};
	}
}
