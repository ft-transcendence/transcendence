import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {      //Data transfer object
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}