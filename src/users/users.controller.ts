import { Body, Get, Post, Controller, Param, Patch, Delete, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { createUserDto } from './DTOs/createuser.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './DTOs/updateuser.dto';
import { userResponseDto } from './DTOs/userresponse.dto';
import {serialize } from './customintecepors';
import { AuthService } from './user.authservice';
import { currentUser } from './Decorators/current-user.decorator';
import { currentUserInteceptor } from './inteceptor/current-user.inteceptor';
import { User } from './user.entity';
import { AuthGuard } from './guards/authguard';
@Controller('/auth')
@serialize(userResponseDto )

export class UsersController {
    constructor(private userservice:UsersService,
        private authservice:AuthService){}

    // @Get('/whoAmI')
    // WhoAmI(@Session() session:any){
    //     return this.userservice.findOneUser(session.userId);
    // }   

    @Get('/whoAmI')
    @UseInterceptors(currentUserInteceptor)

    // @UseGuards(AuthGuard)
    WhoAmI(@currentUser() user:User){
        console.log(user);
        return user;

    }
    


     @Post('/signout')
    SigningOut(@Session() session:any){
        session.userId = null;
    } 
    
    @Post('/signup')
    async createUser(@Body() body:createUserDto, @Session() session:any){
        const user = await this.authservice.signup(body.email, body.password);

        session.userId = user.id;
        
        return user;
    }
    
    @Post('/signin')
    async signInUser(@Body() body:createUserDto, @Session() session:any){
        const user = await this.authservice.signin(body.email, body.password);
        session.userId = user.id;
        console.log(session.userId);
        return user;
    }

    @Get('/:id')
   
    specificUser(@Param('id') id:string){
        return this.userservice.findOneUser(parseInt(id));
    }
    @Get()
    findAllUsers(@Query('email') email:string){
        return this.userservice.findall(email);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id:string){
        return this.userservice.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string,@Body() body:updateUserDto){
        return this.userservice.update(parseInt(id), body);
    }




}
