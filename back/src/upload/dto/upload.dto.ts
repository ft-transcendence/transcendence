import { IsNotEmpty, IsNumber } from 'class-validator';

export class uploadDto {
	@IsNumber()
	@IsNotEmpty()
	userId: number;
}
