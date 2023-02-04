import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { GuildController } from 'src/api/guild/controller/guild.controller';
import { guildProvider } from 'src/api/guild/model/guild.provider';
import { GuildRepository } from 'src/api/guild/repository/guild.repository';
import { GuildService } from 'src/api/guild/service/guild.service';
import { usersProvider } from 'src/api/users/model/users.provider';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GuildController],
  providers: [
    GuildService,
    GuildRepository,
    UserRepository,
    ...guildProvider,
    ...usersProvider,
  ],
  exports: [GuildService],
})
export class GuildModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ///Auth Middleware
    consumer.apply(AuthGuard).forRoutes(GuildController);
  }
}
