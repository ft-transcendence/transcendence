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

	async download_avatar(id: number, avatarURL: string): Promise<any> {
		// Generate uuid filename
		const fileExtension = '.' + avatarURL.split('.').pop();
		const filename = uuidv4() + fileExtension;
		const path = process.env.UPLOAD_DIR + '/' + filename;
		// update user avatar
		await this.userService.updateAvatar(id, filename);
		// create a streamable file
		const writer = createWriteStream(path);
		// get avatar from CDN
		const response = await this.httpService.axiosRef({
			url: avatarURL,
			method: 'GET',
			responseType: 'stream',
		});
		// pipe to file
		response.data.pipe(writer);
		// return Promise when file is downloaded
		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
	}
}
