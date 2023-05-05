import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { authProviders } from 'src/modules/auth/model/auth.provider';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { KittychanModule } from 'src/modules/kitty_chan/kitty_chan.module';
import { guildProvider } from 'src/modules/kitty_chan/model/providers/kitty_guild.provider';
import { KittyGuildRepository } from 'src/modules/kitty_chan/repository/kitty_guild.repository';
import { usersProvider } from 'src/modules/users/model/users.provider';
import { UserModule } from 'src/modules/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { kittyChangRPCOptions } from 'src/microservice/grpc_client_options';
import { AxiosService } from 'src/shared/axios.service';
import { DiscordAPIService } from 'src/shared/discord_api.service';

@Module({
  imports: [
    KittychanModule,
    UserModule,
    DatabaseModule,
    PassportModule,
    ClientsModule.register([...kittyChangRPCOptions]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    DiscordAPIService,
    AxiosService,
    KittyGuildRepository,
    ...authProviders,
    ...guildProvider,
    ...usersProvider,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuard).forRoutes(AuthController);
  }
}
