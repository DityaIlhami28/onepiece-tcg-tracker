import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface OptcgApiCard {
  inventory_price: number;
  market_price: number;
  card_name: string;
  set_name: string;
  card_text: string;
  set_id: string;
  rarity: string;
  card_set_id: string;
  card_color: string;
  card_type: string;
  life: number | null;
  card_cost: string;
  card_power: string;
  sub_types: string;
  counter_amount: number;
  attribute: string;
  date_scraped: string;
  card_image_id: string;
  card_image: string;
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedCardsIfEmpty();
  }

  async seedCardsIfEmpty() {
    const count = await this.prisma.card.count();

    if (count > 0) {
      this.logger.log(`DB already has ${count} cards — skipping seed.`);
      return;
    }

    this.logger.log('DB is empty — seeding 10 cards from OPTCG API...');
    await this.fetchAndSeedCards();
  }

  async fetchAndSeedCards() {
    try {
      const { data } = await axios.get<OptcgApiCard[]>(
        'https://www.optcgapi.com/api/allSetCards/',
        { timeout: 30000 },
      );

      if (!Array.isArray(data)) {
        this.logger.error('Unexpected API response format');
        return;
      }

      // LIMIT TO 10 FOR TESTING
      const limitedData = data.slice(0, 10);

      const cards = limitedData.map((card) => ({
        name: card.card_name,
        setCode: card.card_set_id || card.set_id,
        imageUrl: card.card_image,
        rarity: card.rarity,
        cardType: card.card_type,
      }));

      const chunkSize = 100;
      let seeded = 0;

      for (let i = 0; i < cards.length; i += chunkSize) {
        const chunk = cards.slice(i, i + chunkSize);

        await this.prisma.card.createMany({
          data: chunk as any,
          skipDuplicates: true,
        });

        seeded += chunk.length;
        this.logger.log(`Seeded ${seeded}/${cards.length} cards...`);
      }

      this.logger.log(`✅ TEST SEED COMPLETE — ${seeded} cards saved.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Seed failed: ${message}`);
    }
  }

  async forceReseed() {
    this.logger.log('Force reseeding all cards...');
    await this.fetchAndSeedCards();
  }
}