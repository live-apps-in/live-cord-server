import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ///Server Config
  app.enableCors();

  ///Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  async function bootstrapGrpc() {
    const microserviceOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'live_cord',
        protoPath: join(__dirname, './proto/live_cord.proto'),
        url: process.env.GRPC_URL,
      },
    };
    const grpcApp = await NestFactory.createMicroservice(
      AppModule,
      microserviceOptions,
    );
    grpcApp.listen();
  }

  await app.listen(process.env.PORT);
  await bootstrapGrpc();
}
bootstrap();
