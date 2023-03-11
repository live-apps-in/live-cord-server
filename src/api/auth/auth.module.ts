import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/api/auth/controllers/auth.controller';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { authProviders } from 'src/api/auth/model/auth.provider';
import { AuthService } from 'src/api/auth/service/auth.service';
import { KittychanModule } from 'src/api/kitty_chan/kitty_chan.module';
import { UserModule } from 'src/api/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { AxiosService } from 'src/shared/axios.service';
import { DiscordAPIService } from 'src/shared/discord_api.service';

@Module({
  imports: [KittychanModule, UserModule, DatabaseModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, DiscordAPIService, AxiosService, ...authProviders],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuard).forRoutes(AuthController);
  }
}
