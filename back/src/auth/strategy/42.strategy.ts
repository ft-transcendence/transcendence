/**
 * Creating 42 API Auth strategy
 */

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy } from "passport-42";
import { AuthService } from "../auth.service";

import { Auth42Dto } from "../dto";


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
    Strategy,
    '42auth'
) {
    /**
     * 42 API Auth strategy object constructor
     */
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      clientID: process.env.FORTYTWO_ID,
      clientSecret: process.env.FORTYTWO_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Auth42Dto,
  ) : Auth42Dto {
    return profile;
  }
}