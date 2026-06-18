import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { ScraperModule } from '../scraper/scraper.module';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [ScraperModule, SeedModule],
  controllers: [CardsController],
})
export class CardsModule {}