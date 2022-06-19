import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });  //instantiating the app + enabling CORS (Access-Control-Allow-Origin) 
  // app.enableCors();

  app.useGlobalPipes(new ValidationPipe({           //instantiating the use of Pipes (converts or validates types)
    whitelist: true                                 //only allows data defined in the dto to be received (security)
  }));         
  await app.listen(4000);                           //launching server
}
bootstrap();
