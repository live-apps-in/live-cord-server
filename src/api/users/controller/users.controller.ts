import { Body, Controller, Get, Inject, Post, Request } from '@nestjs/common';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserService } from 'src/api/users/service/users.service';
import { CreateUserDto } from 'src/api/users/_dto/CreateUserDto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(KittychanService)
    private readonly kitty_chanService: KittychanService,
  ) {}

  @Post('/signup')
  async createUser(@Body() user: CreateUserDto): Promise<any> {
    return this.userService.create(user);
  }

  @Get('/profile')
  async profile(@Request() req: any) {
    console.log(req.userData);
    const fetchData = await this.kitty_chanService.profile('Jaga#3176');
    console.log(fetchData);
    // return this.userService.profile(req.userData.userId);
    return fetchData;
  }
}
