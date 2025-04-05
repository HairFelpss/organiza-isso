import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ProfessionalsModule } from './professionals/professionals.module';

@Module({
  imports: [UsersModule, AuthModule, ProfessionalsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthModule],
})
export class AppModule {}
