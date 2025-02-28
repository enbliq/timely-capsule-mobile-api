import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInService } from './sign-in.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly signInService: SignInService,
  ) {}

  @ApiOperation({ summary: 'Create a new auth record' })
  @ApiResponse({ status: 201, description: 'Auth record created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @ApiOperation({ summary: 'Get all auth records' })
  @ApiResponse({ status: 200, description: 'List of auth records retrieved' })
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @ApiOperation({ summary: 'Get an auth record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auth record retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an auth record by ID' })
  @ApiResponse({ status: 200, description: 'Auth record updated successfully' })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @ApiOperation({ summary: 'Delete an auth record by ID' })
  @ApiResponse({ status: 200, description: 'Auth record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.signInService.signIn(signInDto);
  }
}
