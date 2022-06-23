import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
/* JASON WEB TOKEN AUTH MODULE */
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}