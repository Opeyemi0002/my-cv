import { IsOptional, IsEmail, IsNotEmpty, IsString } from "class-validator";
export class updateUserDto {
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    password:string;
} 