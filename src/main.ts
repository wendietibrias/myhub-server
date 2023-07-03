import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
      origin:"*",
      methods:['GET', 'POST' , 'PUT', 'PATCH', 'DELETE']
  });

  app.useStaticAssets(join(__dirname, '..', 'upload/posts'), {
      prefix:"/posts/"
  });
  app.useStaticAssets(join(__dirname, '..', 'upload/comments'), {
      prefix:"/comments/"
  });
  app.useStaticAssets(join(__dirname, '..', 'upload/avatar'), {
      prefix:"/avatar/"
  });

  await app.listen(Number(process.env.PORT));
}
bootstrap();
