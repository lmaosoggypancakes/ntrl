import { Injectable } from '@nestjs/common';
import { Park, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async getParks(): Promise<Park[]> {
    return await this.prisma.park.findMany()
  }

  async createPark(data: Prisma.ParkCreateInput): Promise<Park> {
    return await this.prisma.park.create({
      data
    })
  }
}