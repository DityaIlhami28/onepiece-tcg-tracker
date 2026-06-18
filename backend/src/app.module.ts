import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ScraperModule } from './scraper/scraper.module';
import { SeedModule } from './seed/seed.module';
import { CardsModule } from './cards/cards.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      },
    ),
    ScheduleModule.forRoot(),
    PrismaModule,
    ScraperModule,
    SeedModule,
    CardsModule,
    PricesModule,
  ],
})
export class AppModule {}