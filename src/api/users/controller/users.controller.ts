import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from 'src/api/users/service/users.service';
import { CreateUserDto } from 'src/api/users/_dto/CreateUserDto';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() user: CreateUserDto): Promise<any> {
    return this.userService.create(user);
  }
}
