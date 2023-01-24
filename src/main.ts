import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });

  app
    .use(helmet())
    .setGlobalPrefix('api')
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Documentation API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT Token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/:version/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');
  await app.listen(port || 3000);
})();
