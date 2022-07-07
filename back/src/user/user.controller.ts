import { Controller,
    Get,
    Req,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me') 
    getMe(@Req() req: Request) {
        // log in console
        console.log({
            user: req.user,
        })
        return req.user;
    }
}