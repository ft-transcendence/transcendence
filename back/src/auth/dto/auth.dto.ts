import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO - Data Transfer Object
 * Used to create a new user
 */

export class SignUpDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	username: string;
}

export class SignInDto {
	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	username: string;
}

export class Auth42Dto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
}

export class TwoFactorDto {
	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	twoFAcode: string;
}
