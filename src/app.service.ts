// library imports
import { Injectable } from '@nestjs/common';
import { Park, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  // class declaration for an AppService that can be used anywhere within the server application
  constructor(private prisma: PrismaService) {} // Constructor initializes the Prisma ORM (object-relational mapper) service used to query the database.
  async getParks(): Promise<Park[]> {
    // asynchronous method declaration must return a Promise
    return await this.prisma.park.findMany({ include: { visits: true }}) // findMany() with no arguments returns all of the parks stored in the database.
  }
  async getPark(id: number): Promise<Park> {
    try {
      return await this.prisma.park.findUnique({
        where: { id },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async updatePark(id: number, data: Prisma.ParkUpdateInput): Promise<Park> {
    try {
      return await this.prisma.park.update({
        where: { id },
        data,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async createPark(data: Prisma.ParkCreateInput): Promise<Park> {
    // Prisma.ParkCreateInput is the schema each park should have. Refers to the schema specified in ~/prisma/schema.prisma
    try {
      return await this.prisma.park.create({
        // data is an argument passed into this method which is 'type-checked' by TypeScript to ensure it contains valid data for a new park.
        data,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async visitPark(id: number) {
    try {
      return await this.prisma.park.update({
        where: { id },
        data: {
          visits: {
            create: [{}],
          },
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getVisitsFromPark(id: number) {
    try {
      return await this.prisma.visit.findMany({
        where: {
          parkId: id,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createManyParks(data: Prisma.ParkCreateManyInput) {
    const a = Array(data);
    a.forEach((p) => console.log(a));
    try {
      return await this.prisma.park.createMany({
        data,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
