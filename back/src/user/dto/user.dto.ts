<<<<<<< HEAD
import { IsEmail, IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator'
=======
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator'
>>>>>>> Mvaldes/feature/user private profile (#25)

/*
*	DTO = Data Transfer Object
*	watch for changes in the user model depending on Shu Yen's work :)
*/

export class UserDto {      //Data transfer object
	@IsNumber()
	@IsNotEmpty()
	id: number;  

	@IsString()
	@IsNotEmpty()
	username: string; 

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(65000)
	picture: string; 

	@IsNumber()
	@IsNotEmpty()
	gamesWon: number; 

	@IsNumber()
	@IsNotEmpty()
	gamesLost: number; 

	@IsNumber()
	@IsNotEmpty()
	gamesPlayed: number; 

	added: 		number[];
	adding: 	number[];
	friends: 	number[];

	blocked: 	number[];
	blocking: 	number[];
	blocks: 	number[];
	
} 