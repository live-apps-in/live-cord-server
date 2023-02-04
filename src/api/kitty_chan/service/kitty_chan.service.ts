import { Injectable, Inject } from '@nestjs/common';
import { BOTS } from 'src/core/constants';
import { AxiosService } from 'src/shared/axios.service';

@Injectable()
export class KittychanService {
  constructor(
    @Inject(AxiosService) private readonly axiosService: AxiosService,
  ) {}

  ///Fetch User Profile (Discord)
  async profile(discord_username: string) {
    const getProfile = await this.axiosService.handle({
      scope: BOTS.kitty_chan,
      action: 'profile',
      body: {
        discord_username,
      },
    });

    return getProfile;
  }

  ///DM User
  async send_message(discord_username: string, message: string) {
    const triggerAPI = await this.axiosService.handle({
      scope: BOTS.kitty_chan,
      action: 'send_direct_message',
      body: {
        discord_username,
        message,
      },
    });

    return triggerAPI;
  }
}
