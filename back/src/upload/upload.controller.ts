import {
	Body,
	Controller,
	Get,
	HttpStatus,
	ParseFilePipeBuilder,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from './utils/upload.utils';
import { UserService } from 'src/user/user.service';
import { GetCurrentUserId } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
	constructor(
		private readonly userService: UserService,
		private prisma: PrismaService,
	) {}

	@Post('/avatar')
	@UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
	async uploadAvatar(
		@GetCurrentUserId() userId: number,
		@Body() body: any,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: 'jpeg|jpg|png',
				})
				.addMaxSizeValidator({
					// eslint-disable-next-line unicorn/numeric-separators-style
					maxSize: 1000000,
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		file: Express.Multer.File,
	) {
		// LOG
		console.log(file);

		await this.userService.updateAvatar(userId, file.filename);
		const response = {
			filename: file.filename,
			originalname: file.originalname,
			path: file.path,
		};
		return response;
	}

	@Get('/avatar')
	async getAvatar(
		@GetCurrentUserId() userId: number,
		@Res() response: Response,
	) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return response.sendFile(user.avatar, { root: process.env.UPLOAD_DIR });
	}
}
