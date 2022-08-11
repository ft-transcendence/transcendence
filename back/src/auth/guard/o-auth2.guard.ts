import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth extends AuthGuard('oauth2') {
	constructor() {
		super();
	}
}