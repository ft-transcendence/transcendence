import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

/**
 * DTO - Data Transfer Object
 */

// 2FA DTO
export class TwoFactorDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

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
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsString()
	twoFAsecret: string;
}
