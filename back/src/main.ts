/* GLOBAL MODULES */
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

/* Validation pipes for DTO's */
import { ValidationPipe } from '@nestjs/common';

/* Start the app */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();
  
  // setup app to use validation pipe 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  // start api to listen on port 4000
  await app.listen(process.env.PORT);
}
bootstrap();