import { Body, Controller, Get, Inject, Post, Request } from '@nestjs/common';
import { KittychanService } from 'src/modules/kitty_chan/service/kitty_chan.service';
import { UserService } from 'src/modules/users/service/users.service';
import { CreateUserDto } from 'src/modules/users/_dto/CreateUserDto';

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
    return this.userService.profile(req.userData.userId);
    // const fetchData = await this.kitty_chanService.profile('Jaga#3176');
    // return fetchData;
  }
}
