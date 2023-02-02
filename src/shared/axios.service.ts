import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import APIConfig from '../config/api.config';

interface AxiosConfig {
  method: string;
  route: string;
  url: string;
  headers?: any;
  body?: any;
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

    const axiosConfig = {
      method,
      url: url + route,
      data,
      headers,
    };

    let resData: any;
    await axios(axiosConfig)
      .then((res) => (resData = res.data))
      .catch((err) => {
        console.log(err.message);
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
    const getInternalToken = await this.createAccessToken(
      'kitty_chan',
      payload.body.kitty_chan_username,
    );
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

  private createAccessToken(scope: string, kitty_chan_username: string): any {
    return new Promise((res, rej) => {
      const accessToken = jwt.sign(
        { scope, kitty_chan_username },
        process.env.INTERNAL_MS_SECRET,
        { expiresIn: '60s' },
      );
      res(accessToken);
    });
  }
}
