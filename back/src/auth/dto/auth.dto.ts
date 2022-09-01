import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

/**
 * DTO - Data Transfer Object
 */

// SignUp DTO
export class SignUpDto {
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(50)
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	password: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
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

// Auth Tokens DTO
export class AuthTokenDto {
	@IsString()
	@IsNotEmpty()
	access_token: string;

	@IsString()
	@IsNotEmpty()
	refresh_token: string;
}
