/* GLOBAL MODULES */
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
/* AUTH PassportStrategy */
import { PassportStrategy } from "@nestjs/passport";
/* AUTH JWT */
import { ExtractJwt, Strategy } from "passport-jwt";

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
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    /**
     * Validate function used by Passport Module
     */
    validate(data: any) {
        console.log({
            data,
        })
        return data;
    }

}