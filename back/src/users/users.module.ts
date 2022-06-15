import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from 'src/database/database.module';
//made by greg - not used yet by flo

@Module({
  imports: [DatabaseModule],
  providers: [ ...usersProviders,UsersService ],
  controllers: [UsersController]
})
export class UsersModule {}
