import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

/* 
*	Controllers handle requests and return responses to the client
*   It calls a function from the service class, returning it's result back
*   So it has to instantiate the service
*/

@Controller('auth') 									//naming the route this controller uses
export class AuthController {
	constructor(private authService: AuthService) {}	//the provider (service) is injectable, meaning this instantiates it into the authService var
		
	
	
	@Post('signup')										//this decorator sets up a route, POST writes the params in the HTTP request so the info isn't in the url =/= @GET
	signup() {
		return this.authService.signup();				//calls the service for the right function on that route
	}

	@Post('signin')										//this decorator sets up a route
	signin() {
		return this.authService.signin();
	}
}