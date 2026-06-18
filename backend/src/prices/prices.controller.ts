import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('prices')
export class PricesController {
  constructor(private prisma: PrismaService) {}

  // GET /prices/:cardId/history?days=30&platform=tokopedia
  @Get(':cardId/history')
  async getPriceHistory(
    @Param('cardId') cardId: string,
    @Query('platform') platform?: string,
    @Query('days') days = '30',
  ) {
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    return this.prisma.price.findMany({
      where: {
        cardId: parseInt(cardId),
        ...(platform ? { platform } : {}),
        scrapedAt: { gte: since },
      },
      orderBy: { scrapedAt: 'asc' },
    });
  }

  // GET /prices/:cardId/latest
  @Get(':cardId/latest')
  async getLatestPrices(@Param('cardId') cardId: string) {
    const platforms = ['tokopedia'];
    const results: Record<string, any> = {};

    for (const platform of platforms) {
      const latest = await this.prisma.price.findFirst({
        where: { cardId: parseInt(cardId), platform },
        orderBy: { scrapedAt: 'desc' },
      });
      if (latest) results[platform] = latest;
    }

    return results;
  }
}