import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfessionalsModule } from './professionals/professionals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ torna acessível em todos os módulos
    }),
    UsersModule,
    AuthModule,
    ProfessionalsModule,
    AppointmentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthModule],
})
export class AppModule {}
