import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('')
  async auth() {
    return 'hello';
  }
}
