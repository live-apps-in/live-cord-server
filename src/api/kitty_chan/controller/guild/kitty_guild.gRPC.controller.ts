import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller()
export class KittyGuildGrpcController {
  constructor() {}

  @GrpcMethod('GuildService', 'syncNewGuildMembers')
  async syncNewGuildMembers() {
    return {
      message: 'hi',
    };
  }
}
