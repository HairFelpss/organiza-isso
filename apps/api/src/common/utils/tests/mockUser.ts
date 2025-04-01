import { Role } from '@prisma/client';

export const mockUser = (overrides = {}) => ({
  email: 'mock@email.com',
  password: 'hashed',
  name: 'User',
  document: '12345678900',
  phone: '11999999999',
  role: Role.CLIENT,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
