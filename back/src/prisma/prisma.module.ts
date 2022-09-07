import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/*
 * The prisma module is the way for the code to connect to the database
 * We export from the module the stuff needed by the application
 */

@Global() //Makes PrismaService available to all modules without needing to import
@Module({
	providers: [PrismaService],
	exports: [PrismaService], //needed so the modules accessing the PrismaModule have access to the PrismaService
})
export class PrismaModule {}
