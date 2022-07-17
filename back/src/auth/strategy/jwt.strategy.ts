/* GLOBAL MODULES */
import { Injectable } from '@nestjs/common'
/* AUTH PassportStrategy */
import { PassportStrategy } from "@nestjs/passport";
/* AUTH JWT */
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Creating a JWT strategy
 */

@Injectable()
export class jwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {

    /**
     * JWT strategy object constructor
     */
    constructor(
        private prisma: PrismaService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    /**
     * Validate function used by Passport Module
     */
    async validate(data: {
        sub: number,
        email: string
    }) {
        // log in console
        console.log({
            data,
        })
        const user = await this.prisma.user.findUnique({
            where: {
                id: data.sub,
            }
        });
        // remove sensitive data
        if (user)
            delete user.hash;
        // if the user is not found user == NULL
        // 401 forbidden is returned.
        return user;
    }
}