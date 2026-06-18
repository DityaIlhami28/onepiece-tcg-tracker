import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { TokopediaScraper } from './tokopedia.scraper';
import { FirecrawlProvider } from './firecrawl.provider';
import { ScraperService } from './scraper.service';

@Module({
  controllers: [ScraperController],
  providers: [TokopediaScraper, FirecrawlProvider, ScraperService],
})
export class ScraperModule {}
