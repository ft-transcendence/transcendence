import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsHash, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

export class NewChannelDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    private: boolean;

    // @IsHash()
    @IsString()
    @IsNotEmpty()
    password: string;

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