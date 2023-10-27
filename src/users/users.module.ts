import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './user.authservice';
import { User } from './user.entity';
import { currentUserInteceptor } from './inteceptor/current-user.inteceptor';
@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, currentUserInteceptor,{
    provide:APP_INTERCEPTOR,
    useClass:currentUserInteceptor
  }]
})
export class UsersModule {}
