import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public kitty_chan_username: string;
}
export class InternalCreateUserDto {
  constructor(
    public name: string,
    public email: string,
    public kitty_chan: {
      username: string;
      isVerified: boolean;
    },
  ) {}
}
