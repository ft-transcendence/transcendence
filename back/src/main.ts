import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });  //instantiating the app + enabling CORS (Access-Control-Allow-Origin)
  // app.enableCors();

  await app.listen(4000);                           //launching server
}
bootstrap();
