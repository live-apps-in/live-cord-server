import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      name: 'LiveCord API',
      localPort: 5002,
      prodPort: 5007,
    };
  }
}
