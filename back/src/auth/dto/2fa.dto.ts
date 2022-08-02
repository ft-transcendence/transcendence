import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO - Data Transfer Object
 */

// 2FA DTO
export class TwoFactorDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	twoFAcode: string;
}

// 2FA User DTO
export class TwoFactorUserDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	twoFAsecret: string;
}
