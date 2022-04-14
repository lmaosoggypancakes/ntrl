import { Body, Controller, Get, Post } from '@nestjs/common';
import { Park } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getParks(): Promise<Park[]> {
    return await this.appService.getParks();
  }

  @Post()
  async addPark(
    @Body() parkData: {
      title: string,
      dogabble: boolean,
      activities: string[],
      transportation: string[],
      region: string,
      utilities: string[],
      x: number,
      y: number
    }) {
      const { title, dogabble, activities, transportation, region, utilities, x, y } = parkData
      try {
        return await this.appService.createPark({
          title,
          dogabble,
          activities,
          transportation,
          region,
          utilities,
          x,
          y
        });
      } catch(e) {
        
      }
    }
}
