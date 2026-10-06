import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { BigintInterceptor } from './common/interceptors/bigint.interceptor.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';

async function bootstrap() {
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) {
    throw new Error('CLIENT_URL 환경변수를 설정해주세요');
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new BigintInterceptor(), new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('MyLab API')
    .setDescription('MyLab API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch(console.error);
