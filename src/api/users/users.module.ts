import { Module } from '@nestjs/common/decorators';
import { UserController } from 'src/api/users/controller/users.controller';
import { usersProvider } from 'src/api/users/model/users.provider';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserService } from 'src/api/users/service/users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...usersProvider],
})
export class UserModule {}
