import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(HttpException)
export class HttpToWsFilter extends BaseWsExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const properWsException = new WsException(
			exception.getResponse()['message'],
		);
		super.catch(properWsException, host);
	}
}

@Catch(WsException)
export class ProperWsFilter extends BaseWsExceptionFilter {
	catch(exception: WsException, host: ArgumentsHost) {
		const properWsException = new WsException(exception.getError());
		super.catch(properWsException, host);
	}
}
