import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

/* 
*	Controllers handle requests and return responses to the client
*   It calls a function from the service class, returning it's result back
*   So it has to instantiate the service
*/

@Controller('auth') 									//naming the route this controller uses
export class AuthController {
	constructor(private authService: AuthService) {}	//the provider (service) is injectable, meaning this instantiates it into the authService var
		
	@Get('/')											//on localhost:4000/auth
	testos() {
		return 'coucou bg';								//calls the service for the right function on that route
	}	
	@Post('signup')										//this decorator sets up a route, POST writes the params in the HTTP request so the info isn't in the url =/= @GET
	signup(@Body() dto: any) {							//put the request body into the Data Transfer Object dto
		console.log(dto);
		return this.authService.signup();				//calls the service for the right function on that route
	}

	@Post('signin')										//this decorator sets up a route : /auth/signin
	signin() {
		return this.authService.signin();
	}
}