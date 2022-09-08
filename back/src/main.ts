import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guard';
import { PrismaService } from './prisma/prisma.service';

/* Start the app */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Swagger - OPENAPI
	const config = new DocumentBuilder()
		.setTitle('Transcendence API')
		.setDescription('The API for the Transcendence game')
		.setVersion('0.0.1')
		.addTag('transcendence')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	// Enable CORS
	app.enableCors({
		origin: process.env.FRONT_URL,
	});

	// Setup Prisma
	app.get(PrismaService);

	// setup app to use validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	// set JwtGuard as a global guard
	const reflector = new Reflector();
	app.useGlobalGuards(new JwtGuard(reflector));

	// start api to listen on port 4000
	await app.listen(process.env.BACK_PORT);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
