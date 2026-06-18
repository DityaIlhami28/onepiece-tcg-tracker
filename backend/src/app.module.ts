import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper/scraper.service';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [ScraperModule, ConfigModule.forRoot(
    { isGlobal: true },
  )],
  controllers: [AppController],
  providers: [AppService, ScraperService],
})
export class AppModule {}
