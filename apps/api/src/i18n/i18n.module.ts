import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { I18nMiddleware } from './i18n.middleware';
import { I18nService } from './i18n.service';

@Global()
@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
