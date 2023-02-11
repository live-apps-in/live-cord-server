import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { KittyGuildController } from 'src/api/kitty_chan/controller/kitty_guild.controller';
import { KittyRolesController } from 'src/api/kitty_chan/controller/roles/kitty_roles.controller';
import { GuildAccess } from 'src/api/kitty_chan/middlewares/permission.middleware';
import { guildProvider } from 'src/api/kitty_chan/model/kitty_guild.provider';
import { KittyGuildRepository } from 'src/api/kitty_chan/repository/kitty_guild.repository';
import { KittyDiscordService } from 'src/api/kitty_chan/service/discord/KittyDiscord.service';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { KittyGuildService } from 'src/api/kitty_chan/service/kitty_guild.service';
import { KittyRolesService } from 'src/api/kitty_chan/service/roles/kitty_role.service';
import { usersProvider } from 'src/api/users/model/users.provider';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserModule } from 'src/api/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { AxiosService } from 'src/shared/axios.service';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [KittyGuildController, KittyRolesController],
  providers: [
    KittychanService,
    KittyRolesService,
    KittyDiscordService,
    KittyGuildService,
    KittyGuildRepository,
    UserRepository,
    AxiosService,
    ...guildProvider,
    ...usersProvider,
  ],
  exports: [KittychanService],
})
export class KittychanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ///Guild Controller
    consumer.apply(AuthGuard).forRoutes(KittyGuildController);

    ///Roles Controller
    consumer.apply(AuthGuard).forRoutes(KittyRolesController);
    consumer.apply(GuildAccess).forRoutes(KittyRolesController);
  }
}
