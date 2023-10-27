import { Injectable, BadRequestException, NotFoundException, BadGatewayException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt  } from "crypto";
import { promisify } from "util";
@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async signup(email:string, password: string){
        const oldUser = await this.userService.findall(email);

        if(oldUser.length) {
            throw new BadRequestException('this email is registered already');
        }
        const scrypt = promisify(_scrypt);

        const salt = randomBytes(10).toString("hex");

        const Hash = (await scrypt (password, salt, 32)) as Buffer;

        const hashResult = salt + "." + Hash.toString('hex');

        const newUser = await this.userService.create(email, hashResult);

        return newUser;

        
        
    }

    async signin (email:string, password: string){
        const [checkUser] = await this.userService.findall(email);

        if(!checkUser) {
            throw new NotFoundException('email or password is not correct');
        }

        const [salt, hashedPassword] = checkUser.password.split('.');

        const scrypt = await promisify(_scrypt);
        const hashInputPassword = (await scrypt(password, salt, 32)) as Buffer;

        if(hashedPassword !== hashInputPassword.toString('hex')){
            throw new BadGatewayException('email or password is not correct');
        }
        return checkUser;

        
    
    }

    }
