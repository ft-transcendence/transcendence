import { DataSource } from 'typeorm';
import { UserEntity } from './entities/users.entity';
//greg's file, not used for now

export const usersProviders = [
  {
    provide: 'USER_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];