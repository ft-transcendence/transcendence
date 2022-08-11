import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guard';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/* Start the app */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = new DocumentBuilder()
		.setTitle('ft_trascendence')
		.setDescription('API description')
		.setVersion('0.0.1')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	// Enable CORS
	app.enableCors({
		origin: process.env.SITE_URL + ':' + process.env.FRONT_PORT,
	});

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
	await app.listen(process.env.PORT);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
