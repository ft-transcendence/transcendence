import { IsArray, IsBoolean, IsEmail, IsHash, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
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

    @IsNumber()
    @IsNotEmpty()
    channelId: number;

    @IsString()
    @IsNotEmpty()
    msg: string;

    @IsNumber()
    @IsOptional()
    msgId: number;
}

export class DMDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    added_id: number;
}