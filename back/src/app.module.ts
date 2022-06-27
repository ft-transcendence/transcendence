import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { GameGateway } from './game/game.gateway';

/* Modules are classes, here app.module, annotated with the module decorator.
* Like any decorator, this adds metadata to a class or function.
* Modules can import other mmodules - here, UsersModule, DbModule, etc.
* They import controllers and providers too (see in users controllers and providers for defs)
* This one is the main module, it will import all the others.
*/

@Module({
	imports: [AuthModule, 
						UserModule, 
						PrismaModule, 
						ConfigModule.forRoot({isGlobal: true}), GameModule,	//for integration of the .env + global so available all around
					],
	providers: [GameService, GameGateway],		
//greg- imports: [UsersModule, DatabaseModule],
	// controllers: [AppController],                  //useless as we deleted these files
	// providers: [AppService],                       //useless as we deleted these files
})
export class AppModule {}   //exporting means this class will be available for all other ones in the project

