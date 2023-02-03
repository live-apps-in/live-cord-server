import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserRepository } from 'src/api/users/repository/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(KittychanService)
    private readonly kittychanService: KittychanService,
  ) {}
  async send_otp(_id: Types.ObjectId) {
    const user = await this.userRepo.findById(_id);
    if (!user) throw new HttpException('User not found', 400);

    const discord_username = user.discord.username;
    const triggerKittyChan = await this.kittychanService.send_message(
      discord_username,
      'Hello',
    );
    return {
      message: 'OTP Sent',
    };
  }
}
