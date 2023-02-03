import { NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

///Auth Middleware
export class AuthGuard implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token: string = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access Denied. No Token Provided.');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      const { email, apps } = decoded;
      if (!email || !apps?.live_cord?.userId)
        return res.status(400).send('Token Malformed');

      req.userData = {
        email,
        userId: apps.live_cord.userId,
      };

      next();
    } catch (err) {
      console.log(err);
      return res.status(400).send('Invalid Token.');
    }
  }
}

///Internal Microservice Auth
export class InternalAuthGuard implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers['x-internal-token'];
    if (!token) {
      return res.status(401).send('Access Denied. No Token Provided.');
    }

    try {
      const decoded = jwt.verify(token, process.env.INTERNAL_MS_SECRET);
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(400).send('Invalid Token.');
    }
  }
}
