import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CapsulesService } from "./capsules.service"
import { CapsulesController } from "./capsules.controller"
import { Capsule, CapsuleSchema } from "../models/capsule.schema"
import { EncryptionModule } from "../encryption/encryption.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Capsule.name, schema: CapsuleSchema }]),
    EncryptionModule,
  ],
  controllers: [CapsulesController],
  providers: [CapsulesService],
  exports: [CapsulesService],
})
export class CapsulesModule {}
