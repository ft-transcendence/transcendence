import { IsEmail, IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator'

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


	

//   game history

//       friends		User[]		@relation(name: "relationships", references: [id])  
//       blocked		User[]		@relation(name: "relationships", references: [id])

//     admin       Channel[] @relation("admin")
//     member      Channel[] @relation("member")
//     chanBlocked Channel[] @relation("blocked")
} 