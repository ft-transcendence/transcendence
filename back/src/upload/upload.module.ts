import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';

@Module({
	//imports: [UserModule],
	providers: [UploadService, UserService, GameService],
	controllers: [UploadController],
})
export class UploadModule {}
