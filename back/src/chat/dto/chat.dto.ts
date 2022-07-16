import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsHash, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, maxLength } from 'class-validator';
import { Tag } from '../type/chat.type';


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

    @IsArray()
    @IsOptional()
    members: Array<Tag>;

}

export class UseMsgDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    msg: string;

    @IsNumber()
    @IsOptional()
    msgId: number;
}