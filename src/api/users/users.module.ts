import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators';
import { AuthGuard, InternalAuthGuard } from 'src/api/auth/guards/auth.guard';
import { UserController } from 'src/api/users/controller/users.controller';
import { usersProvider } from 'src/api/users/model/users.provider';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserService } from 'src/api/users/service/users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...usersProvider],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ///Auth Middleware
    consumer
      .apply(AuthGuard)
      .forRoutes({ path: 'user/profile', method: RequestMethod.GET });

    ///Internal Auth Middleware
    consumer
      .apply(InternalAuthGuard)
      .forRoutes({ path: 'user/signup', method: RequestMethod.POST });
  }
}
