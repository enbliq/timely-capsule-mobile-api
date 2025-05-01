import { Module, forwardRef } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UsersModule } from "../users/users.module"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { APP_GUARD } from "@nestjs/core"
import { GuestOrAuthGuard } from "./guards/guest-or-auth.guard"
import { RolesGuard } from "./guards/roles.guard"
import { PasswordRecoveryService } from "./password-recovery.service"
import { PasswordRecoveryController } from "./password-recovery.controller"
import { PasswordReset, PasswordResetSchema } from "./schemas/password-reset.schema"

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    MongooseModule.forFeature([{ name: PasswordReset.name, schema: PasswordResetSchema }]),
  ],
  controllers: [AuthController, PasswordRecoveryController],
  providers: [
    AuthService,
    JwtStrategy,
    PasswordRecoveryService,
    {
      provide: APP_GUARD,
      useClass: GuestOrAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, PasswordRecoveryService],
})
export class AuthModule {}
