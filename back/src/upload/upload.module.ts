import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
	imports: [forwardRef(() => HttpModule), forwardRef(() => UserModule)],
	providers: [UploadService],
	controllers: [UploadController],
	exports: [UploadService],
})
export class UploadModule {}
