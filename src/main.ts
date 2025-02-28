import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/filters/global-exception.filter';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  /**Swagger Configuration */
  const config = new DocumentBuilder()
    .setTitle('TIMELY CAPSULE - timely-capsule-api')
    .setDescription('Use the base Api URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
      transform: true, // Transforms input to match DTO types (e.g., string to number)
    }),

    // Apply the global exception filter
    // new GlobalExceptionFilter(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter())

  await app.listen(3000);
}
bootstrap();
