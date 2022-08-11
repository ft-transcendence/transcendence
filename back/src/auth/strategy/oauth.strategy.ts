/* Global Modules */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InternalOAuthError, Strategy } from 'passport-oauth2';
import { Url } from 'node:url';

interface ProfileAttributes {
	email: string;
	login: string;
	firstName: string;
	lastName: string;
	url: Url;
	imageUrl: Url;
}

interface Profil_42API {
	readonly [attributes: string]: ProfileAttributes;
}

type Profile_42 = Profil_42API;

@Injectable()
export class oAuth42Strategy extends PassportStrategy(Strategy, 'oauth2') {
	constructor() {
		super({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: process.env.FORTYTWO_ID,
			clientSecret: process.env.FORTYTWO_SECRET,
			callbackURL: 'http://localhost:4000/auth/oauth/callback',
			customHeaders: { 'Content-Type': 'application/vnd.api+json' },
		});
	}

	userProfile(
		accessToken: string,
		done: (error?: Error, profile?: any) => void,
	): void {
		console.log('oAuth token to 42 API', accessToken);
		this._oauth2.get(
			'https://api.intra.42.fr/v2/me',
			accessToken,
			(error, body) => {
				if (error) {
					return done(
						new InternalOAuthError(
							'Failed to fetch user profile',
							error,
						),
					);
				}
				try {
					// convert incoming data to JSON
					const json = JSON.parse(body.toString());
					done(undefined, json.data);
				} catch (error_) {
					done(error_);
				}
			},
		);
	}

	validate(accessToken: string, refreshToken: string, profile: Profile_42) {
		//console.log('oAuth profile - JSON', profile);
		const { id, attributes } = profile;

		const { email, login, firstName, lastName, url, imageUrl } = attributes;

		console.log(
			'profile',
			email,
			login,
			firstName,
			lastName,
			url,
			imageUrl,
		);

		const user: ProfileAttributes = {
			email,
			login,
			firstName,
			lastName,
			url,
			imageUrl,
		};
		/*const user = profile.attributes;
		const {
			email,
			login,
			'first-name': firstname,
			'last-name': lastname,
		} = user;
		console.log('test', email, login, firstname, lastname);
		return {
			email, login, firstname, lastname,
		};
		*/
		console.log(user);
		return user;
	}
}
