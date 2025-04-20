import { Injectable } from '@nestjs/common';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

@Injectable()
export class I18nService {
  constructor() {
    this.initializeI18n();
  }

  private async initializeI18n() {
    await i18next.use(Backend).init({
      backend: {
        loadPath: join(__dirname, 'locales/{{lng}}.json'),
      },
      fallbackLng: 'en',
      preload: ['en', 'pt'],
      supportedLngs: ['en', 'pt'],
      ns: ['translation'],
      defaultNS: 'translation',
      detection: {
        order: ['querystring', 'header'],
        lookupQuerystring: 'lang',
        lookupHeader: 'accept-language',
      },
    });
  }

  t(key: string, options?: Record<string, any>) {
    return i18next.t(key, options);
  }

  changeLanguage(lng: string) {
    return i18next.changeLanguage(lng);
  }

  getLanguage() {
    return i18next.language;
  }
}
