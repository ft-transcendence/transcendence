/* GLOBAL MODULES */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// @GetCurrentUser decorator - used to get current user
export const GetCurrentUser = createParamDecorator(
	(data: string | undefined, context: ExecutionContext) => {
		// Get request from context
		const request = context.switchToHttp().getRequest();
		// Extract user from request
		if (!data) {
			return request.user;
		}
		// Extract user data from request
		return request.user[data];
	},
);
