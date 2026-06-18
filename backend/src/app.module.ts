import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper/scraper.service';
import { ScraperModule } from './scraper/scraper.module';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';
import { CardsController } from './cards/cards.controller';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [ScraperModule, ConfigModule.forRoot(
    { isGlobal: true },
  ), SeedModule, CardsModule],
  controllers: [AppController, CardsController],
  providers: [AppService, ScraperService, SeedService],
})
export class AppModule {}
