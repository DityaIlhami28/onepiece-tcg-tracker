import { Controller, Get, Query } from '@nestjs/common';
import { TokopediaScraper } from './tokopedia.scraper';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly tokopediaScraper: TokopediaScraper,
  ) {}

  @Get('tokopedia')
  async test(@Query('card') card: string) {
    return this.tokopediaScraper.scrape(card);
  }
}