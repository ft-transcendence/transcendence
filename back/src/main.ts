import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Instatiate the validation pipes
  app.useGlobalPipes(new ValidationPipe({
    // Only needed data is received
    whitelist: true
  }));
  app.enableCors();
  // Start NestJS application
  await app.listen(4000);
}
bootstrap();