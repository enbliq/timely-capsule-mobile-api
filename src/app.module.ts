import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';


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
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => ({
        store: redisStore,
        socket: {
          host: 'localhost',
          port: 6379,
        },
        ttl: 600, // 10 minutes
      }),
    }),
    UserModule,
    AuthModule,
    TransactionModule,
    GuestModule,
    CapsuleModule,
    PaginationModule,
    AdminModule,
    ActivityLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[CacheModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ActivityLoggerMiddleware).forRoutes('*');
  }
}
