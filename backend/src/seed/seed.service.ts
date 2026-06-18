import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface OpTcgCard {
  id: string;
  name: { en?: string; jp?: string };
  images?: { en?: string; jp?: string };
  rarity?: string;
  type?: string;
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

    this.logger.log('DB is empty — seeding cards from One Piece TCG API...');
    await this.fetchAndSeedCards();
  }

  async fetchAndSeedCards() {
    try {
      // Fetch all cards from the unofficial OP TCG API
      const { data } = await axios.get<OpTcgCard[]>(
        'https://apiv2.api.onepiece-cardgame.com/opcg/card',
        { timeout: 30000 },
      );

      if (!Array.isArray(data)) {
        this.logger.error('Unexpected API response format');
        return;
      }

      // Map API response to our schema
      const cards = data
        .map((card) => ({
          name: card.name?.en || card.name?.jp || null,
          setCode: card.id || null,        // e.g. "OP01-060"
          imageUrl: card.images?.en || card.images?.jp || null,
          rarity: card.rarity || null,
          cardType: card.type || null,
        }))
        .filter((c) => c.name !== null);  // skip cards with no name

      // Batch insert in chunks of 100 to avoid DB limits
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

      this.logger.log(`✅ Seed complete — ${seeded} cards saved.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Seed failed: ${message}`);
      // App continues even if seed fails — not fatal
    }
  }

  // Call this to force a reseed (e.g. new card set released)
  async forceReseed() {
    this.logger.log('Force reseeding all cards...');
    await this.fetchAndSeedCards();
  }
}