import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

/* Start the app */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();

  const prismaService = app.get(PrismaService);
  // setup app to use validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // start api to listen on port 4000
  await app.listen(4000);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
