import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './user.authservice';
import { User } from './user.entity';
import {NotFoundException} from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeuserservice: Partial< UsersService>;
  let fakeauthservice:Partial<AuthService>;
  beforeEach(async () => {
    fakeuserservice = {
      findOneUser:(id:number)=>{
        return Promise.resolve({id, email:'eri@gmail.com',password:'moyin'} as User);
      },
      findall:(email:string)=>{
        return Promise.resolve([{id:1, email,password:'Moyin'} as User]);
      },
      // remove:()=>{},
      // update:()=>{}
        
      }

    fakeauthservice ={
      // signup:()=>{},
      // signin:()=>{}
    }
        
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[{
        provide: UsersService,
        useValue: fakeuserservice
      },{
         provide: AuthService,
        useValue: fakeauthservice
      }
    ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllusers should return all result with a given email', async()=>{
    const users = await controller.findAllUsers('eri@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('eri@gmail.com');

    // expect(users).toBeDefined();
  });
  it('find a user with a given id', async()=>{
    const user = await controller.specificUser('1');
    expect(user).toBeDefined();
  });
  it('findOneUser throws an error if given id is not found', async()=>{
    fakeuserservice.findOneUser = null; 
    

    await expect(controller.specificUser('10')).rejects.toThrow(NotFoundException);
  });
});



    
    