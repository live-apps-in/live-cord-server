import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AUTH_CONTENT } from 'src/api/auth/content/auth.content';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { random_numbers } from 'src/utils/numbers/number';

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

    const discord_id = user.discord?.id;
    if (!discord_id)
      throw new HttpException('No valid Discord Username found', 400);

    ///Generate OTP
    const otp = random_numbers(6);
    const triggerKittyChan = await this.kittychanService.send_message(
      discord_id,
      AUTH_CONTENT.send_otp(otp),
    );

    return {
      message: 'OTP Sent',
    };
  }
}
