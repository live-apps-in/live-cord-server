import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { KittyGuildController } from 'src/modules/kitty_chan/controller/guild/kitty_guild.controller';
import { KittyRolesController } from 'src/modules/kitty_chan/controller/roles/kitty_roles.controller';
import { GuildAccess } from 'src/modules/kitty_chan/middlewares/permission.middleware';
import { guildProvider } from 'src/modules/kitty_chan/model/providers/kitty_guild.provider';
import { KittyGuildRepository } from 'src/modules/kitty_chan/repository/kitty_guild.repository';
import { DiscordAPIService } from 'src/shared/discord_api.service';
import { KittychanService } from 'src/modules/kitty_chan/service/kitty_chan.service';
import { KittyGuildService } from 'src/modules/kitty_chan/service/kitty_guild.service';
import { KittyRolesService } from 'src/modules/kitty_chan/service/roles/kitty_role.service';
import { usersProvider } from 'src/modules/users/model/users.provider';
import { UserRepository } from 'src/modules/users/repository/users.repository';
import { UserModule } from 'src/modules/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { AxiosService } from 'src/shared/axios.service';
import { kittyReactionRolesProvider } from 'src/modules/kitty_chan/model/providers/kitty_reaction_roles.provider';
import { KittyReactionRolesRepo } from 'src/modules/kitty_chan/repository/roles/kitty_reaction_roles.repo';
import { ClientsModule } from '@nestjs/microservices';
import { kittyChangRPCOptions } from 'src/microservice/grpc_client_options';
import { KittyGuildGrpcController } from 'src/modules/kitty_chan/controller/guild/kitty_guild.gRPC.controller';
@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ClientsModule.register([...kittyChangRPCOptions]),
  ],
  controllers: [
    KittyGuildController,
    KittyGuildGrpcController,
    KittyRolesController,
  ],
  providers: [
    KittychanService,
    KittyRolesService,
    DiscordAPIService,
    KittyGuildService,
    KittyGuildRepository,
    KittyReactionRolesRepo,
    UserRepository,
    AxiosService,
    ...guildProvider,
    ...usersProvider,
    ...kittyReactionRolesProvider,
  ],
  exports: [KittychanService, KittyGuildRepository],
})
export class KittychanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ///Auth Middleware
    consumer.apply(AuthGuard).forRoutes(KittyGuildController);
    consumer.apply(AuthGuard).forRoutes(KittyRolesController);

    ///Guild Access
    consumer
      .apply(GuildAccess)
      .exclude({ path: '', method: RequestMethod.GET });
    consumer.apply(GuildAccess).forRoutes(KittyRolesController);
  }
}
