import { Expose } from "class-transformer";

export class userResponseDto {
    @Expose()
    id:number;

    @Expose()
    email:string;

}