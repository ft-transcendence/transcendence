/* GLOBAL MODULES */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Create @GetCurrentUser decorator - used to get current userID
export const GetCurrentUserId = createParamDecorator(
	(data: undefined, context: ExecutionContext) => {
		// Get request from context
		const request = context.switchToHttp().getRequest();
		// LOG
		// console.log('user', request.user);
		// Extract userID from request
		return request.user.id;
	},
);
