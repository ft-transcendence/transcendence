import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    // imports: [PrismaModule],         //useless as we set the PrismaModule as global
    controllers: [AuthController],      //handles requests and returns responses to the client
    providers: [AuthService]            //used to create relationships between objects
})
export class AuthModule {}