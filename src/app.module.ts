import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  // App module declaration. Tells NestJS what services and controllers (route handlers are being used.)
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
