import {
  Module,
  type NestModule,
  type MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { AuditInterceptor } from './audit/interceptors/audit.interceptor';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { GuestUserMiddleware } from './auth/middleware/guest-user.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*')
      .apply(GuestUserMiddleware)
      .forRoutes('*');
  }
}
