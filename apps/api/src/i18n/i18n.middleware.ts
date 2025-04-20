import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { I18nService } from './i18n.service';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly i18nService: I18nService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const lang = (req.query.lang as string) || req.headers['accept-language'];
    if (lang) {
      void this.i18nService.changeLanguage(lang);
    }
    next();
  }
}
