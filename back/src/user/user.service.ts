import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

//from nestjs tutorial :
//   private readonly cats: Cat[] = [];

//   create(cat: Cat) {
//     this.cats.push(cat);
//   }

//   findAll(): Cat[] {
//     return this.cats;
//   }

//should have the getMe, the getAll
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
        ) {} 
}

/* gremit code : (will be deleted)
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
*/