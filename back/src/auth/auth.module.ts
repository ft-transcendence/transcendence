import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    // imports: [PrismaModule],
    controllers: [AuthController],      //handles requests and returns responses to the client
    providers: [AuthService]            //used to create relationships between objects
})
export class AuthModule {}