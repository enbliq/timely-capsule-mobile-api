import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY) // Inject jwtConfig directly
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  generateAccessToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.signOptions.expiresIn,
      audience: this.jwtConfiguration.signOptions.audience,
      issuer: this.jwtConfiguration.signOptions.issuer,
    });
  }


  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
