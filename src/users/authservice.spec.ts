import { Test } from "@nestjs/testing";
import { AuthService } from "./user.authservice";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException,NotFoundException } from "@nestjs/common";


describe('AuthService', ()=> {

let service:AuthService
let fakeuserservice: Partial<UsersService>

beforeEach(async() =>{
    fakeuserservice = {
        findall:() => Promise.resolve([]) ,
        create:(email:string, password:string)=> Promise.resolve({id:1, email, password} as User)
    };
    
    const module = await Test.createTestingModule({
        providers: [AuthService, {
            provide:UsersService,
            useValue:fakeuserservice
        }],
    }).compile();

    service = module.get(AuthService);
});

it('can create an instance of auth service', async()=>{
    
    expect(service).toBeDefined();
})

it('create a user with a sorted password', async()=> {

        const user = await service.signup('eri@gmail.com', 'eri');

        expect(user.password).not.toEqual('eri');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
})

it('throws an error if user signs up with email that is in use', async()=> {
    fakeuserservice.findall = () =>
        Promise.resolve([{id:1, email:'a',password:'1'} as User]);
    
          await expect(service.signup('eri@gmail.com', 'moyin')).rejects.toThrow(BadRequestException,);

        

        })

it(' signin is called with right email', async()=> {
    fakeuserservice.findall =()=> Promise.resolve([{email:'a', password:'1'} as User]);

    const user = await expect(service.signin('eri@gmail.com', 'moyin'));


    expect(user).toBeDefined();
});

it('throws if signin is called with an unused email', async()=> {
    
    await expect(service.signin('errr@gmail.com', 'jkkfkfk')).rejects.toThrow(NotFoundException);

    
})



});
