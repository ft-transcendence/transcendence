import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength} from 'class-validator';

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
	@MinLength(8)
	@MaxLength(16)
	password: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	username: string;
}

// Signin DTO
export class SignInDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	@MinLength(8)
	password: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
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
