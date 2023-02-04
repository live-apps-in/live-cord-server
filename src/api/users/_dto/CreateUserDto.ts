import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public discord_username: string;
}
export class InternalCreateUserDto {
  constructor(
    public name: string,
    public email: string,
    public discord: {
      id?: string;
      username: string;
      isVerified: boolean;
    },
  ) {}
}
