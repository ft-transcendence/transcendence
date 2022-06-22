import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
//made by greg - not used yet by flo

@Module({
  providers: [ ...usersProviders,UsersService ],
  controllers: [UsersController]
})
export class UsersModule {}
