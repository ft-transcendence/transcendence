import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'node:fs';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
	constructor(
		private readonly httpService: HttpService,
		private userService: UserService,
	) {}

	async download_avatar(avatarURL: string, id: number): Promise<any> {
		console.log(avatarURL);
		const fileExtension = '.' + avatarURL.split('.').pop();
		const filename = uuidv4() + fileExtension;
		const path = process.env.UPLOAD_DIR + '/' + filename;
		console.log('filename:', filename);
		console.log('path', path);

		await this.userService.updateAvatar(id, filename);

		const writer = createWriteStream(path);

		console.log('OG url', avatarURL);

		const response = await this.httpService.axiosRef({
			url: avatarURL,
			method: 'GET',
			responseType: 'stream',
		});

		response.data.pipe(writer);
		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
	}
}
