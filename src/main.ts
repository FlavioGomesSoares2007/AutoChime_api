import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL não foi definida');
  }

  app.enableCors({
    origin: (origi:any, callback:any) => {
      if (!origin || origin === frontendUrl) {
        return callback(null, true);
      }

      console.log(`CORS bloqueado: ${origin}`);
      console.log(`Origem permitida: ${frontendUrl}`);

      return callback(new Error('Acesso bloqueado pelo CORS'));
    },

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