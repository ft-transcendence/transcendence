import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guard';
import { PrismaService } from './prisma/prisma.service';

/* Start the app */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();
  
  const prismaService = app.get(PrismaService);
  // setup app to use validation pipe 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  // set JwtGuard as a global guard
  const reflector = new Reflector;
  app.useGlobalGuards(new JwtGuard(reflector));
  // start api to listen on port 4000
  await app.listen(process.env.PORT);
}

bootstrap();