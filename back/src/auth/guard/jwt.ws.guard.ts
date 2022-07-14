import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from "@nestjs/jwt";
import { jwt } from "@nestjs/jwt"

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService) {
  }

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const token = context.args[0].handshake.headers.token.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      return new Promise((resolve, reject) => {
        return this.userService.getUser(decoded.userId).then(user => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });

      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
