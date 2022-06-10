import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPO')
        private userRepo: Repository<UserEntity>,
    ) {}
    async findAll() {
        const users = await this.userRepo.find();
        return users;
    }

    async createUser(username: string, password: string) {
        const user = this.userRepo.create({username, password});
        return await (await this.userRepo.save(user)).toResponseObject();
    }
}
