import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
//from the YT tuto, to be used
@Module({
  controllers: [UserController]
})
export class UserModule {}
