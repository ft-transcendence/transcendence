import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [UserService, GameService],
	controllers: [UploadController],
})
export class UploadModule {}
