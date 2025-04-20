import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { z } from 'zod';

// Schema para validação dos cookies
const cookiesSchema = z.record(z.string().optional());

// Interface para tipagem dos cookies
export interface CookiesFromRequest {
  [key: string]: string | undefined;
}

/**
 * Decorator para obter todos os cookies da requisição
 * @example
 * @Get()
 * handler(@Cookies() cookies: CookiesFromRequest) {
 *   console.log(cookies);
 * }
 */
export const Cookies = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): CookiesFromRequest => {
    const request = ctx.switchToHttp().getRequest();
    const cookies = request.cookies;

    const parsedCookies = cookiesSchema.safeParse(cookies);

    if (!parsedCookies.success) {
      throw new BadRequestException('Invalid cookies format');
    }

    return parsedCookies.data;
  },
);

/**
 * Decorator para obter um cookie específico da requisição
 * @param cookieName Nome do cookie a ser obtido
 * @example
 * @Get()
 * handler(@Cookie('refreshToken') refreshToken: string) {
 *   console.log(refreshToken);
 * }
 */
export const Cookie = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext): string => {
    if (!cookieName) {
      throw new BadRequestException('Cookie name must be provided');
    }

    const request = ctx.switchToHttp().getRequest();
    const cookies = request.cookies;

    const parsedCookies = cookiesSchema.safeParse(cookies);

    if (!parsedCookies.success) {
      throw new BadRequestException('Invalid cookies format');
    }

    const cookie = parsedCookies.data[cookieName];

    if (!cookie) {
      throw new BadRequestException(`Cookie ${cookieName} not found`);
    }

    return cookie;
  },
);
