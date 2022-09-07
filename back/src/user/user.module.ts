import { forwardRef, Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [GameModule, forwardRef(() => PrismaModule)],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
