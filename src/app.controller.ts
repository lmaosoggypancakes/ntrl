// controller inputs
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Park, Prisma } from '@prisma/client';
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
    return newPark;
    // submitted bad data (missing certain fields, park name already taken, etc)
  }
  @Get('/:id')
  async getPark(@Param('id') id: number) {
    const park = await this.appService.getPark(id);
    if (!park) throw new NotFoundException(`Park with ID ${id} not found :(`);
    return park;
  }

  @Put('/:id')
  async updatePark(
    @Param('id') id: number,
    @Body() data: Prisma.ParkUpdateInput,
  ) {
    const park = await this.appService.updatePark(id, data);
    if (!park) throw new NotFoundException(`Park with ID ${id} not found :(`);
    return park;
  }

  @Put('/visit/:id')
  async visitPark(@Param() id: number) {
    const park = await this.appService.visitPark(id);
    if (!park) throw new NotFoundException(`Park with ID ${id} not found :(`);
    return park;
  }
}
