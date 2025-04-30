import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import type { UsersService } from '../users/users.service';
import {
  PasswordReset,
  type PasswordResetDocument,
} from './schemas/password-reset.schema';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordResetDocument>,
    private usersService: UsersService,
  ) {}

  async createPasswordResetToken(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');

    // Remove any existing tokens for this user
    await this.passwordResetModel.deleteMany({ email: user.email });

    // Create a new password reset token
    const passwordReset = new this.passwordResetModel({
      email: user.email,
      token,
      userId: user._id,
      createdAt: new Date(),
    });

    await passwordReset.save();

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return a success message
    // The actual email sending would be implemented in a separate email service

    return {
      message: 'Password reset link has been sent to your email',
      // Include the token in the response for testing purposes
      // In production, this would be sent via email only
      token,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const passwordReset = await this.passwordResetModel.findOne({
      token: resetPasswordDto.token,
    });

    if (!passwordReset) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const user = await this.usersService.findByEmail(passwordReset.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, salt);

    // Update the user's password
    await this.usersService.update(user._id.toString(), {
      passwordHash,
    } as any);

    // Delete the password reset token
    await this.passwordResetModel.deleteOne({ _id: passwordReset._id });

    return { message: 'Password has been reset successfully' };
  }
}
