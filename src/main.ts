import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const configService = new ConfigService();
  console.log('JWT Secret:', configService.get('JWT_SECRET'));

  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
      transform: true, // Transforms input to match DTO types (e.g., string to number)
    }),
  );

  await app.listen(3000);
}
bootstrap();
