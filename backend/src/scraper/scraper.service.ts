import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TokopediaScraper } from './tokopedia.scraper';
// import { ShopeeScraper } from './shopee.scraper';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private prisma: PrismaService,
    private tokopedia: TokopediaScraper,
    // private shopee: ShopeeScraper,
  ) {}

  // Auto-refresh every 6 hours — only cards users have searched
  @Cron(CronExpression.EVERY_6_HOURS)
  async scheduledScrape() {
    const cards = await this.prisma.card.findMany({
      where: { prices: { some: {} } },
    });

    this.logger.log(`Scheduler: refreshing ${cards.length} cards...`);

    for (const card of cards) {
      await this.scrapeCard(card.name);
      await this.delay(3000); // 3s between cards to avoid rate limits
    }
  }

  async scrapeCard(cardName: string) {
    // Upsert card — create if doesn't exist
    const card = await this.prisma.card.upsert({
      where: { name: cardName },
      create: { name: cardName },
      update: {},
    });

    // Scrape both platforms in parallel
    const [tokopediaResult] = await Promise.allSettled([
      this.tokopedia.scrape(cardName),
    //   this.shopee.scrape(cardName),
    ]);

    const allResults = [
      ...(tokopediaResult.status === 'fulfilled' ? tokopediaResult.value : []),
    //   ...(shopeeResult.status === 'fulfilled' ? shopeeResult.value : []),
    ];

    if (allResults.length > 0) {
      await this.prisma.price.createMany({
        data: allResults.map((r) => ({
          cardId: card.id,
          platform: r.platform,
          price: r.price,
          title: r.title,
          url: r.url,
        })),
      });
    }

    this.logger.log(`Saved ${allResults.length} prices for "${cardName}"`);
    return allResults;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}