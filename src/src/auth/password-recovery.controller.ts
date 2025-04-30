import { Body } from "@nestjs/common"
import type { PasswordRecoveryService } from "./password-recovery.service"
import type { ForgotPasswordDto } from "./dto/forgot-password.dto"
import type { ResetPasswordDto } from "./dto/reset-password.dto"

export class PasswordRecoveryController {
  constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordRecoveryService.createPasswordResetToken(forgotPasswordDto);
  }

  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(resetPasswordDto);
  }
}
