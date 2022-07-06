import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsHash, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    hash: string;
}

export class ChannelDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    private: boolean;

    // @IsHash()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    password: string;

}

export class NewMsgDto {

    @IsEmail()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    channelId: number;

    @IsString()
    @IsNotEmpty()
    msg: string;
}