import { Module } from '@nestjs/common';
import { AuthController } from 'src/api/auth/controllers/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
