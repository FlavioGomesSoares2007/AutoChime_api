import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;

  app.enableCors({
    origin: (origin: any, callback: any) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origin === frontendUrl) {
        return callback(null, true);
      }

      return callback(new Error('Acesso bloqueado pelo CORS'));
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],

    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
