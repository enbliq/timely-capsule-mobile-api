import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { CapsulesModule } from "./capsules/capsules.module"
import { MediaModule } from "./media/media.module"
import { FundsModule } from "./funds/funds.module"
import { GeolocksModule } from "./geolocks/geolocks.module"
import { UsersModule } from "./users/users.module"
import { EncryptionModule } from "./encryption/encryption.module"
import { StorageModule } from "./storage/storage.module"
import storageConfig from "./config/storage.config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [storageConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
    }),
    CapsulesModule,
    MediaModule,
    FundsModule,
    GeolocksModule,
    UsersModule,
    EncryptionModule,
    StorageModule,
  ],
})
export class AppModule {}
