import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {      //prismaClient is an existing class allowing to connect to a db, it has some base functions already
    constructor() {     
        super({                                        //calls the constructor of the class being extended
            datasources: {
                db: {
                    url: 'postgresql://prisma:secret@localhost:5432/dbdata?schema=public'   // to change with the .env DATABASE_URL
                }
            }
        })                 
    }
}