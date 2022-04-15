// controller inputs
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { Park } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // AppService is the one declared in ~/src/app.service.ts

  // TypeScript method decorator to explicitly state that this method should run when a user sends a GET request to the home page of the server url.
  // Returns, in JSON, a list of all parks.
  @Get()
  async getParks(): Promise<Park[]> {
    return await this.appService.getParks();
  }

  // Likewise, the @Post() decorator provided by NestJS tells the server that this method should run when a user sends a POST request to the server.
  // i.e, the user wants to add a new park to the database.
  @Post()
  async addPark(
    @Body() // Specifies that the server should look for the park data the user submitted to the server in the body of the HTTP request.
    parkData: Park,
  ) {
    const newPark = await this.appService.createPark(parkData);
    if (!newPark) throw new BadRequestException(); // In case of any errors, throw an HTTP 400 error code that explains the user
    // submitted bad data (missing certain fields, park name already taken, etc)
  }
}
