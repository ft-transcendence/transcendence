import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UserService } from 'src/user/user.service';

@Module({
	providers: [UploadService, UserService],
	controllers: [UploadController],
})
export class UploadModule {}
