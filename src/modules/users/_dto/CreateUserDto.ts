import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;
}
export class InternalCreateUserDto {
  constructor(public name: string, public email: string) {}
}
