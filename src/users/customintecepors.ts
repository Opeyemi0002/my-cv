import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable, map } from "rxjs";
import {plainToClass} from "class-transformer";

interface classConstructor {
    new (...args:any[]):{}
}
export function serialize(dto:classConstructor){
 return UseInterceptors(new SerialInteceptor(dto))
}

export class SerialInteceptor implements NestInterceptor{
    constructor(private dto: any){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        
        return next.handle().pipe(
            map((data:any)=> {
                return plainToClass(this.dto, data,{
                    excludeExtraneousValues:true
                });
            })
        );
    }
}


