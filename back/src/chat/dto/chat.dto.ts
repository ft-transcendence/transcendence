import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsHash, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, maxLength } from 'class-validator';

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

}

export class NewMsgDto {

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    channelId: number;

    @IsString()
    @IsNotEmpty()
    msg: string;
}