/* GLOBAL MODULES */
import { ExecutionContext, Injectable } from '@nestjs/common';
/* Attach METADATA */
import { Reflector } from '@nestjs/core';
/* AUTH Guard Passport Module */
import { AuthGuard } from '@nestjs/passport';

// Global guard to protect all route
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super();
	}
	// Validate function
	canActivate(context: ExecutionContext) {
		// Get metadata from context
		const isPublic = this.reflector.getAllAndOverride('isPublic', [
			context.getHandler(),
			context.getClass(),
		]);
		// if the route is public, return true
		if (isPublic) return true;
		// if the route is not public - pass to JwtGuard
		return super.canActivate(context);
	}
}
