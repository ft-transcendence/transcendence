import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
//greg's file, not used for now

@Controller('users')
export class UsersController 
{
    constructor(
        private userService : UsersService,
    ){}
    @Get()
    getAllUsers() {
        return this.userService.findAll();
    }
}