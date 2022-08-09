import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { createReadStream } from 'node:fs';

@Injectable()
export class UploadService {
	constructor(private readonly httpService: HttpService) {}
	async download(
		url: string,
		userId: number,
	): Observable<AxiosResponse<any>> {
		const file = createReadStream(url);
	}
}
