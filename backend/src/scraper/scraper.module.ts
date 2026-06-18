import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { TokopediaScraper } from './tokopedia.scraper';
import { FirecrawlProvider } from './firecrawl.provider';
import { ScraperService } from './scraper.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScraperController],
  providers: [TokopediaScraper, FirecrawlProvider, ScraperService],
  exports: [ScraperService]
})
export class ScraperModule {}
