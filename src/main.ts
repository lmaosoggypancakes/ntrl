import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable Cross-Origin Resource Sharing. Allows the client application to communicate with this server.
  await app.listen(process.env.PORT || 8000); // Listen this server on TCP Port 8000 or another port explicitly stated by Heroku.
}
bootstrap();
