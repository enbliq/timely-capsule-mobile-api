import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MediaService } from "./media.service"
import { MediaController } from "./media.controller"
import { Media, MediaSchema } from "../models/media.schema"
import { StorageModule } from "../storage/storage.module"
import { EncryptionModule } from "../encryption/encryption.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]), StorageModule, EncryptionModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
