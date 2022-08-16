import { IsNotEmpty, IsString } from 'class-validator';

export class uploadDto {
	@IsString()
	@IsNotEmpty()
	userId: number;
}
