import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
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
import { uploadDto } from './dto';
import { ReadableStreamWithFileType } from 'file-type';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Upload')
@ApiHeader({ name: 'Avatars', description: 'Upload and Retrieve avatars' })
@Controller('upload')
export class UploadController {
	constructor(
		private readonly userService: UserService,
		private prisma: PrismaService,
	) {}

	/**
	 * Upload image to storage
	 * 
	 * @param userId : number - id of user
	 * @param body : any - body of request
	 * @param file : Express.Multer.File - file of request
	 * @returns object containing filename, originalname, path of file
	 */
	@Post('/avatar')
	@ApiResponse({ status: 400, description: 'Invalid File' })
	@ApiResponse({ status: 422, description: 'Invalid File' })
	@HttpCode(201)
	@UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
	async uploadAvatar(
		@GetCurrentUserId() userId: number,
		@Body() body: ReadableStreamWithFileType,
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

	/**
	 * Return the avatar of current user
	 * 
	 * @param userId : number - id of user
	 * @param response : Response - Express response object
	 * @returns Current User avatar
	 */

	@Get('/avatar')
	@HttpCode(200)
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

	/**
	 * Return the avatar of any given user
	 * 
	 * @param body : any - body of request
	 * @param response : Response - Express response object
	 * @returns Avatar of user with given id
	 */

	@Post('/getavatar')
	@ApiResponse({ status: 400, description: 'Invalid id' })
	@HttpCode(200)
	async getAvatarByUserId(
		@Body() body: uploadDto,
		@Res() response: Response,
	) {
		const id = Number(body.userId);
		if (id === Number.NaN) {
			throw new BadRequestException('Invalid user id');
		}
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		if (!user) {
			throw new BadRequestException('User not found');
		}
		return response.sendFile(user.avatar, { root: process.env.UPLOAD_DIR });
	}
}
