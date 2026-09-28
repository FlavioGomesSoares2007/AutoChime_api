import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL não foi definida');
  }

  console.log('CORS permitido:', frontendUrl);

  app.enableCors({
    origin: frontendUrl,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
    ],

    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
}

bootstrap();