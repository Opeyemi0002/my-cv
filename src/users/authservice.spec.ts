import { Test } from "@nestjs/testing";
import { AuthService } from "./user.authservice";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException,NotFoundException } from "@nestjs/common";


describe('AuthService', ()=> {

let service:AuthService
let fakeuserservice: Partial<UsersService>

beforeEach(async() =>{
    const Users:User[]=[];
    fakeuserservice = {
        findall:(email:string) => {
        const filteredUser = Users.filter((user)=> user.email===email);
        return Promise.resolve(filteredUser); 
        },
        create:(email:string, password:string)=> {
            const user = {id:Math.floor(Math.random()*10), email,password} as User;
            Users.push(user);
            return Promise.resolve(user);
        }
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
    await service.signup('ola@gmail.com', 'ola')
    const user = await service.signin('ola@gmail.com', 'ola');

    expect(user).toBeDefined();
});

it('throws if signin is called with an unused email', async()=> {
    
    await expect(service.signin('errr@gmail.com', 'jkkfkfk')).rejects.toThrow(NotFoundException);

    
})



});
