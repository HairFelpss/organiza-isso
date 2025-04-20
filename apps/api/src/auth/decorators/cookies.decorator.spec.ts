// // apps/api/src/common/decorators/__tests__/cookies.decorator.spec.ts
// import { BadRequestException, ExecutionContext } from '@nestjs/common';
// import { Cookie, Cookies, CookiesFromRequest } from './cookies.decorator';

// describe('Cookies Decorators', () => {
//   let mockContext: ExecutionContext;

//   beforeEach(() => {
//     mockContext = {
//       switchToHttp: jest.fn().mockReturnValue({
//         getRequest: jest.fn().mockReturnValue({
//           cookies: {},
//         }),
//       }),
//     } as unknown as ExecutionContext;
//   });

//   const mockRequest = (cookies: Record<string, string> | null = {}) => {
//     jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
//       cookies,
//     });
//     return mockContext;
//   };

//   // Obtém o handler do decorator com tipagem segura
//   const getCookiesValue = (context: ExecutionContext): CookiesFromRequest => {
//     const handler = Cookies();
//     // Acessamos a função factory do decorator que foi criada pelo createParamDecorator
//     const factory = handler[0];
//     return factory(undefined, context) as CookiesFromRequest;
//   };

//   const getCookieValue = (
//     cookieName: string | undefined,
//     context: ExecutionContext,
//   ): string => {
//     const handler = Cookie(cookieName);
//     const factory = handler[0];
//     return factory(cookieName, context) as string;
//   };

//   describe('Cookies Decorator', () => {
//     it('should return all cookies when valid', () => {
//       const cookies = {
//         refreshToken: 'test-refresh-token',
//         sessionId: 'test-session-id',
//       };

//       mockRequest(cookies);
//       const result = getCookiesValue(mockContext);

//       expect(result).toEqual(cookies);
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException when cookies are null', () => {
//       mockRequest(null);

//       expect(() => getCookiesValue(mockContext)).toThrow(
//         new BadRequestException('Invalid cookies format'),
//       );
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException when cookies are undefined', () => {
//       mockRequest(undefined);

//       expect(() => getCookiesValue(mockContext)).toThrow(
//         new BadRequestException('Invalid cookies format'),
//       );
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });
//   });

//   describe('Cookie Decorator', () => {
//     it('should return specific cookie when it exists', () => {
//       const cookies = {
//         refreshToken: 'test-refresh-token',
//       };

//       mockRequest(cookies);
//       const result = getCookieValue('refreshToken', mockContext);

//       expect(result).toBe('test-refresh-token');
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException when cookie name is empty', () => {
//       mockRequest({});

//       expect(() => getCookieValue('', mockContext)).toThrow(
//         new BadRequestException('Cookie name must be provided'),
//       );
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException when cookie name is not provided', () => {
//       mockRequest({});

//       expect(() => getCookieValue(undefined, mockContext)).toThrow(
//         new BadRequestException('Cookie name must be provided'),
//       );
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException when specific cookie is not found', () => {
//       mockRequest({});

//       expect(() => getCookieValue('nonexistent', mockContext)).toThrow(
//         new BadRequestException('Cookie nonexistent not found'),
//       );
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException when cookies are invalid', () => {
//       mockRequest(null);

//       expect(() => getCookieValue('refreshToken', mockContext)).toThrow(
//         new BadRequestException('Invalid cookies format'),
//       );
//       expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
//     });
//   });
// });
