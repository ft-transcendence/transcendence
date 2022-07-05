import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsInt()
    @IsNotEmpty()
    channel: number;
}

export class NewMsgDto {

    @IsEmail()
    @IsNotEmpty()
    public userId: number;

    @IsNumber()
    @IsNotEmpty()
    public channelId: number;

    @IsString()
    @IsNotEmpty()
    public msg: string;
}