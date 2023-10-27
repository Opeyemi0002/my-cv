import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo:Repository<User>){}

    async create(email: string, password: string){
        const newUser = this.userRepo.create({email, password});

        return await this.userRepo.save(newUser);
    }

    async findOneUser(id:number){
        const newUser = await this.userRepo.findOneBy({id});
        if(!newUser){
            throw new NotFoundException('the user cannot be found');
        }
        return newUser;
    }

    async findall (email:string){
        const user = await this.userRepo.find({where:{email}})
        if(!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    async update(id:number, attrs: Partial<User>){
        const userToUpdate = await this.userRepo.findOneBy({id})

        if(!userToUpdate){
            throw new NotFoundException('user not found ');
        }
        Object.assign(userToUpdate, attrs);
        await this.userRepo.save(userToUpdate);

    }
    async remove(id:number){
        const removeUser = await this.userRepo.findOneBy({id});
        if(!removeUser ){
            throw new NotFoundException('user not found ');
        }
        return this.userRepo.remove(removeUser)
        

    }
    
}
