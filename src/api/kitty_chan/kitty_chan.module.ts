import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { KittyGuildController } from 'src/api/kitty_chan/controller/kitty_guild.controller';
import { guildProvider } from 'src/api/kitty_chan/model/kitty_guild.provider';
import { KittyGuildRepository } from 'src/api/kitty_chan/repository/kitty_guild.repository';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { KittyGuildService } from 'src/api/kitty_chan/service/kitty_guild.service';
import { usersProvider } from 'src/api/users/model/users.provider';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserModule } from 'src/api/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { AxiosService } from 'src/shared/axios.service';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [KittyGuildController],
  providers: [
    KittychanService,
    KittyGuildService,
    KittyGuildRepository,
    UserRepository,
    AxiosService,
    ...guildProvider,
    ...usersProvider,
  ],
  exports: [KittychanService, KittyGuildService],
})
export class KittychanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuard).forRoutes(KittyGuildController);
  }
}
