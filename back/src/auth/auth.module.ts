import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
/* JASON WEB TOKEN AUTH MODULE */
import { JwtModule } from "@nestjs/jwt";
import { jwtStrategy } from "./strategy";
import { FortyTwoStrategy } from "./strategy/42.strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, jwtStrategy, FortyTwoStrategy],
})

export class AuthModule {}