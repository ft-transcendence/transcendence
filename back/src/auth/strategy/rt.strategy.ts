import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RtStrategy extends PassportStrategy(
    Strategy , 
    'jwt-refresh'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }
    async validate(request: Request, data: any) {
        const refreshToken = request.get('authorization').replace('Bearer ', '').trim();
                console.log(data);
                return {
                    ...data,
                    refreshToken,
                };
    }
}