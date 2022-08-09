import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

/*
 *	DTO = Data Transfer Object
 *	watch for changes in the user model depending on Shu Yen's work :)
 */

export class UserDto {
	//Data transfer object
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
	@MaxLength(65_000)
	avatar: string;

	@IsNumber()
	@IsNotEmpty()
	gamesWon: number;

	@IsNumber()
	@IsNotEmpty()
	gamesLost: number;

	@IsNumber()
	@IsNotEmpty()
	gamesPlayed: number;

	@IsNumber()
	@IsNotEmpty()
	rank: number;

	added: number[];
	adding: number[];
	friends: number[];

	blocked: number[];
	blocking: number[];
	blocks: number[];

	@Exclude()
	hash: string;

	@Exclude()
	hashedRtoken: string;
}
