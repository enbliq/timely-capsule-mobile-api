import { MiddlewareConsumer,  NestModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../config/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { GuestModule } from './guest/guest.module';
import { CapsuleModule } from './capsule/capsule.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { AdminModule } from './admin/admin.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ActivityLoggerMiddleware } from './common/middleware/activity-logger/activity-logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataResponseInterceptor } from './common/data-response/data-response-interceptor.interceptor';
import { MetricsModule } from './metrics/metrics.module';
import { ContentModule } from './content/content.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      synchronize: true,
      autoLoadEntities: true,
      // useFactory: (configService: ConfigService) => ({
      //   type: 'postgres', // Add this line
      //   // host: configService.get('DB_HOST'),
      //   // port: configService.get('DB_PORT'),
      //   // username: configService.get('DB_USER'),
      //   // password: configService.get('DB_PASSWORD'),
      //   // database: configService.get('DB_NAME'),
      //   url: configService.get('DB_URL'),
      //   synchronize: true,
      //   autoLoadEntities: true,
      // }),
    }),
    UserModule,
    AuthModule,
    TransactionModule,
    GuestModule,
    CapsuleModule,
    PaginationModule,
    AdminModule,
    ActivityLogModule,
    // MetricsModule,
    // ContentModule,
    // RecommendationModule,
    // SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ActivityLoggerMiddleware).forRoutes('*');
  }
}
