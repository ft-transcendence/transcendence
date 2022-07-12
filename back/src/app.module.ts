import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { GameGateway } from './game/game.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

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
						ChatModule,
						ConfigModule.forRoot({isGlobal: true}), 
						GameModule,	
					],
	providers: [GameService, GameGateway],		

})
// export to enable globally
export class AppModule {}

