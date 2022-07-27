import { UserDto } from 'src/user/dto';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

/*
 *	This is the type of game that is used in
 *	-Latest Games-
 */
export class SubjectiveGameDto {
	@IsNumber()
	@IsNotEmpty()
	userId: number;

	@IsNumber()
	@IsNotEmpty()
	opponentId: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(65_000)
	opponentAvatar: string;

	@IsString()
	@IsNotEmpty()
	opponentUsername: string;

	@IsString()
	@IsNotEmpty()
	opponentUser: UserDto;

	@IsNumber()
	@IsNotEmpty()
	opponentRank: number;

	@IsNumber()
	@IsNotEmpty()
	duration: number;

	@IsNumber()
	@IsNotEmpty()
	userScore: number;

	@IsNumber()
	@IsNotEmpty()
	opponentScore: number;

	@IsNotEmpty()
	victory: boolean;
}
