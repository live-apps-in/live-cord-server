import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from 'src/api/auth/controllers/auth.controller';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { KittychanModule } from 'src/api/kitty_chan/kitty_chan.module';

@Module({
  imports: [KittychanModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .forRoutes({ path: '/auth/discord/send_otp', method: RequestMethod.GET });
  }
}
