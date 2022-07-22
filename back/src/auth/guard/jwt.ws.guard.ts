import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService, private readonly jwtService: JwtService) {}

  async canActivate(context: any): Promise<any> {
    const token = String(context.args[0].handshake.headers.token);
    const UserId: number = await this.jwtService.verify(token, {secret: process.env.JWT_SECRET}).userId;
    const user = await this.userService.getUser(UserId);
    if (!user) {
      throw new UnauthorizedException();                                        
    }
    return user;
  }
}
