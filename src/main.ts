import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://auto-chime-cli.vercel.app',
      'https://auto-chime-cli-git-main-flaviogomessoares2007s-projects.vercel.app',
      'https://auto-chime-jmndz0ury-flaviogomessoares2007s-projects.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT!);
}
bootstrap();