import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUsernameDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
	username: string;
}

export class UpdateEmailDto {
	@IsString()
	@IsEmail()
	@MaxLength(50)
	@IsNotEmpty()
	email: string;
}
