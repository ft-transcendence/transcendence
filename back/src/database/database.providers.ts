import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'prisma',
        password: 'secret',
        database: 'dbdata',
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true, //true for dev, false for prod
      });

      return dataSource.initialize();
    },
  },
];