import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'live_cord',
    protoPath: join(__dirname, '../../proto/live_cord.proto'),
  },
};
