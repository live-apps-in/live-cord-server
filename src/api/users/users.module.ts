import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators';
import { AuthGuard, InternalAuthGuard } from 'src/api/auth/guards/auth.guard';
import { authProviders } from 'src/api/auth/model/auth.provider';
import { guildProvider } from 'src/api/kitty_chan/model/kitty_guild.provider';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserController } from 'src/api/users/controller/users.controller';
import { usersProvider } from 'src/api/users/model/users.provider';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserService } from 'src/api/users/service/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { AxiosService } from 'src/shared/axios.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    KittychanService,
    AxiosService,
    ...usersProvider,
    ...authProviders,
    ...guildProvider,
  ],
  exports: [UserService, UserRepository],
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
