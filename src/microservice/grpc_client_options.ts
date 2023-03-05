import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

// Same options object used by microservice server
export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'kitty_chan',
    protoPath: join(__dirname, '../../proto/kitty_chan.proto'),
    url: '127.0.0.1:5030',
  },
};
