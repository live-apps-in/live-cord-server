import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from 'src/api/auth/controllers/auth.controller';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { AuthService } from 'src/api/auth/service/auth.service';
import { KittychanModule } from 'src/api/kitty_chan/kitty_chan.module';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserModule } from 'src/api/users/users.module';

@Module({
  imports: [KittychanModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .forRoutes({ path: '/auth/discord/send_otp', method: RequestMethod.GET });
  }
}
