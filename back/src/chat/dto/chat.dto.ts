import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsHash, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, maxLength } from 'class-validator';

export class ChannelDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    private: boolean;

    @IsOptional()
    @IsString()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string

}

export class NewMsgDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    msg: string;
}