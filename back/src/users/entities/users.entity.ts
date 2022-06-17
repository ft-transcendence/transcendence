import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
//greg's file, not used for now

@Entity('Users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password)
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject() {
        return {id: this.id, username: this.username}
    }
}