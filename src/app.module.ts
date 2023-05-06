import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { KittychanModule } from 'src/modules/kitty_chan/kitty_chan.module';
import { UserModule } from 'src/modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'dotenv';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    KittychanModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
