import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO - Data Transfer Object
 */

// SignUp DTO
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

// Signin DTO
export class SignInDto {
	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	username: string;
}

// 42 API DTO
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
