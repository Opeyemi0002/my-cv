import { ExecutionContext, CallHandler, NestInterceptor, Injectable } from "@nestjs/common/";
import { UsersService } from "../users.service";

@Injectable()
export class currentUserInteceptor implements NestInterceptor {
    constructor(private userservice: UsersService){}

   async intercept(context:ExecutionContext, handler:CallHandler) {
    const request = context.switchToHttp().getRequest();

    const{ userId } = request.session || {}
    if (!userId){
        return handler.handle();
    }
    const user = await this.userservice.findOneUser(userId);
     request.currentuser = user;
    
    }
}