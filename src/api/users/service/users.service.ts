import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { CreateUserDto } from 'src/api/users/_dto/CreateUserDto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async create(payload: CreateUserDto) {
    ///Check User Duplication
    const getUser = await this.userRepo.findByEmail(payload.email);
    if (getUser) throw new HttpException('User Already Exists', 400);

    return await this.userRepo.create(payload);
  }
}
