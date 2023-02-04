import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { GuildModule } from 'src/api/guild/guild.module';
import { KittychanModule } from 'src/api/kitty_chan/kitty_chan.module';
import { UserModule } from 'src/api/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, UserModule, GuildModule, KittychanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
