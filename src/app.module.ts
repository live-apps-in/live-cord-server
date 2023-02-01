import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserModule } from 'src/api/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
