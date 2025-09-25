import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  // 将filtter配置成全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 配置全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤掉没有被验证的属性
    }),
  );
  app.use(cors());
  await app.listen(3000);
}
bootstrap();
