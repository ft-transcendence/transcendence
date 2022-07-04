import { ArrayMinSize, IsArray, IsBoolean, isInt, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MsgDto {

    @IsString()
    @IsNotEmpty()
    public owner: string;

    @IsString()
    @IsNotEmpty()
    public channel: string;

    @IsString()
    @IsNotEmpty()
    public msg: string;
}