import { NestFactory } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"
import { TransformInterceptor } from "./common/interceptors/transform.interceptor"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Global prefix
  app.setGlobalPrefix("api")

  // Enable CORS
  app.enableCors()

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter())

  // Global transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor())

  const port = configService.get<number>("PORT") || 3000
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}/api`)
}
bootstrap()
