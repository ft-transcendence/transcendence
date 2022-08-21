import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class RedirectOnLogin implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const status = exception.getStatus();
		const url = new URL(process.env.SITE_URL);
		url.port = process.env.FRONT_PORT;
		url.pathname = '/auth/signin';
		response.status(status).redirect(url.href);
	}
}
