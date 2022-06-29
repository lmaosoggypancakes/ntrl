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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Park, Prisma } from '@prisma/client';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // AppService is the one declared in ~/src/app.service.ts
  @UseGuards(AuthGuard)
  @Get('/hello')
  async hello(@Query('key') key: string) {
    return key;
  }
  // TypeScript method decorator to explicitly state that this method should run when a user sends a GET request to the home page of the server url.
  // Returns, in JSON, a list of all parks.
  @Get()
  async getParks(): Promise<Park[]> {
    return await this.appService.getParks();
  }

  /* API endpoints for creating, deleting, viewing, or updating a park */

  // Likewise, the @Post() decorator provided by NestJS tells the server that this method should run when a user sends a POST request to the server.
  // i.e, the user wants to add a new park to the database.
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Post('/many')
  async addManyParks(@Body() parksData: Prisma.ParkCreateInput) {
    const newParks = await this.appService.createManyParks(parksData);
    if (!newParks) throw new BadRequestException('Bad park input data :(');
    return newParks;
  }

  @Get('/:id') // when a request is sent to get the data of a park with a certain ID
  async getPark(@Param('id') id) {
    id = parseInt(id);
    const park = await this.appService.getPark(id);
    if (!park) throw new NotFoundException(`Park with ID ${id} not found :(`); // HTTP 404
    return park;
  }
  @UseGuards(AuthGuard) // only authorized users should be able to edit a park
  @Put('/:id')
  async updatePark(@Param('id') id, @Body() data: Prisma.ParkUpdateInput) {
    id = parseInt(id);
    const park = await this.appService.updatePark(id, data);
    if (!park) throw new NotFoundException(`Park with ID ${id} not found :(`);
    return park;
  }
  // A park is "visited" when a user clicks on it and is redirected to google maps.
  @Put('/visit/:id') // used directly by the frontend client; no authorization required
  async visitPark(@Param('id') id) {
    id = parseInt(id);
    const park = await this.appService.visitPark(id);
    if (!park) throw new NotFoundException(`Park with ID ${id} not found :(`);
    return park;
  }
  @UseGuards(AuthGuard)
  @Get('/visits/:id') // only authorized users should be able to view the visits a park has
  async getVisitsFromPark(@Param('id') id) {
    id = parseInt(id);
    const visits = await this.appService.getVisitsFromPark(id);
    if (!visits) throw new NotFoundException(`Park with ID ${id} not found :(`);
    return visits;
  }
}
