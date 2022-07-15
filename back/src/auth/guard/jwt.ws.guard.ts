import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService, private readonly jwtService: JwtService) {}

  async canActivate(context: any): Promise<any> {
    const user = await this.userService.getUser((this.jwtService.verify(context.args[0].handshake.headers.token.split(' ')[1]).userId));
    if (!user) {
      throw new UnauthorizedException();                                        
    }
    return user;
  }
}
