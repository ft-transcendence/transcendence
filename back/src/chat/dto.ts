import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsIn, isInt, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NewUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    // @IsString()
    // @IsNotEmpty()
    // password: string;
}

export class NewMsgDto {

    @IsInt()
    @IsNotEmpty()
    public userId: number;

    @IsInt()
    @IsNotEmpty()
    public channelId: number;

    @IsString()
    @IsNotEmpty()
    public msg: string;
}