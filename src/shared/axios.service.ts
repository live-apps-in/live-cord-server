import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import APIConfig from '../config/api.config';

export interface AxiosConfig {
  method: string;
  route: string;
  url: string;
  headers?: any;
  body?: any;
}

export interface InternalAuthPayload {
  scope: string;
  discord_username?: string;
  discord_id?: string | null;
  guildId?: string | null;
}

interface APIActionDTO {
  scope: string;
  action: string;
  body?: any;
}

@Injectable()
export class AxiosService {
  /////Global Axios Config
  async axiosInstance(payload: any): Promise<any> {
    const { method, route, url, body, headers } = payload;

    const data = {
      ...body,
    };

    const axiosConfig: any = {
      method,
      url: url + route,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method)) axiosConfig.data = data;

    let resData: any;
    await axios(axiosConfig)
      .then((res) => (resData = res.data))
      .catch((err) => {
        console.log(err);
        throw new HttpException('Bad Request - Internal API fail', 400);
        // console.log(err);
      });
    return resData;
  }

  async handle(payload: APIActionDTO) {
    const getConfig: AxiosConfig = await this.APIConfigFactory(payload);
    return await this.axiosInstance(getConfig);
  }

  ////Extract API config
  private async APIConfigFactory(payload: APIActionDTO): Promise<AxiosConfig> {
    const { scope, action } = payload;

    ///Fetch URL, Route, Method
    const baseUrl = APIConfig?.[scope]?.baseURL;
    const getAction = APIConfig?.[scope]?.actions?.[action];
    if (!baseUrl || !getAction)
      throw new HttpException('Invalid Scope or Action', 400);

    ///Fetch and build Headers(Auth)
    const getInternalToken = await this.createAccessToken({
      scope: 'kitty_chan',
      discord_username: payload.body.discord_username,
      discord_id: payload.body.discord_id,
      guildId: payload.body.guildId,
    });
    const getHeader = APIConfig.kitty_chan.header(getInternalToken);

    const axiosConfig: AxiosConfig = {
      method: getAction.method,
      route: getAction.route,
      url: baseUrl,
      headers: getHeader,
      body: payload.body,
    };

    return axiosConfig;
  }

  public createAccessToken(payload: InternalAuthPayload): any {
    const { scope, discord_username, discord_id, guildId } = payload;

    return new Promise((res) => {
      const accessToken = jwt.sign(
        { scope, discord_username, discord_id, guildId },
        process.env.INTERNAL_MS_SECRET,
        { expiresIn: '10s' },
      );
      res(accessToken);
    });
  }
}
