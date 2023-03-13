import * as grpc from '@grpc/grpc-js';
import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

// Same options object used by microservice server
export const kittyChangRPCOptions: ClientsModuleOptions = [
  {
    name: 'kitty_chan_grpc',
    transport: Transport.GRPC,
    options: {
      package: 'kitty_chan',
      protoPath: join(__dirname, '../proto/kitty_chan.proto'),
      url: '0.0.0.0:5030',
      credentials: grpc.credentials.createInsecure(),
    },
  },
];
