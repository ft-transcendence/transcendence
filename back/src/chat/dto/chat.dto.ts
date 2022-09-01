import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Tag } from '../type/chat.type';

export class ChannelDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsBoolean()
	private: boolean;

	@IsBoolean()
	isPassword: boolean;

	@IsOptional()
	@IsString()
	password: string;

	@IsEmail()
	email: string;

	@IsArray()
	@IsOptional()
	members: Array<Tag>;
}

export class UseMessageDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

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
	targetId: number;
}
