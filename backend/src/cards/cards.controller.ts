import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';
import { SeedService } from '../seed/seed.service';

@Controller('cards')
export class CardsController {
  constructor(
    private prisma: PrismaService,
    private scraperService: ScraperService,
    private seedService: SeedService,
  ) {}

  // GET /cards — all cards (paginated, 50 at a time)
  @Get()
  async getAllCards(@Query('page') page = '1') {
    const take = 50;
    const skip = (parseInt(page) - 1) * take;

    const [cards, total] = await Promise.all([
      this.prisma.card.findMany({
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          prices: {
            orderBy: { scrapedAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.card.count(),
    ]);

    return { cards, total, page: parseInt(page), pages: Math.ceil(total / take) };
  }

  // GET /cards/search?q=Luffy
  @Get('search')
  async searchCards(@Query('q') query: string) {
    if (!query || query.length < 2) return [];

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    // Find matching cards from DB
    const cards = await this.prisma.card.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      include: {
        prices: {
          orderBy: { scrapedAt: 'desc' },
          take: 1,
        },
      },
      take: 10,
    });

    // Check if prices are stale or missing for the first match
    const needsScrape =
      cards.length === 0 ||
      !cards[0].prices[0] ||
      cards[0].prices[0].scrapedAt < sixHoursAgo;

    if (needsScrape) {
      // Fire scrape in background — don't await so search returns fast
      this.scraperService.scrapeCard(query).catch(() => null);
    }

    return cards;
  }

  // GET /cards/:id
  @Get(':id')
  async getCard(@Param('id') id: string) {
    return this.prisma.card.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // POST /cards/:id/scrape — manual refresh
  @Post(':id/scrape')
  async triggerScrape(@Param('id') id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: parseInt(id) },
    });
    if (!card) return { error: 'Card not found' };
    return this.scraperService.scrapeCard(card.name);
  }

//   POST /admin/reseed — force reseed from OP TCG API
  @Post('admin/reseed')
  async reseed() {
    await this.seedService.forceReseed();
    return { message: 'Reseed started' };
  }
}