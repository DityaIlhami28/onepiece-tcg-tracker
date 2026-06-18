import { Injectable, Logger, Inject } from '@nestjs/common';
import FirecrawlApp from '@mendable/firecrawl-js';
import { FIRECRAWL } from './firecrawl.provider';

export interface ScrapedPrice {
  title: string;
  price: number;
  url: string;
  platform: string;
}

@Injectable()
export class TokopediaScraper {
  private readonly logger = new Logger(TokopediaScraper.name);

  constructor(
    @Inject(FIRECRAWL)
    private readonly firecrawl: FirecrawlApp,
  ) {}

  async scrape(cardName: string): Promise<ScrapedPrice[]> {
    try {
      const query = encodeURIComponent(cardName);
      const url = `https://www.tokopedia.com/search?st=product&q=${query}`;

      this.logger.log(`Scraping Tokopedia for card: ${cardName}`);
      //   const result = await this.firecrawl.scrapeUrl(url, {
      //     formats: ['markdown'],
      //   });
      //   console.log(result.markdown);
      //   console.log(JSON.stringify(result, null, 2));

      const result = await this.firecrawl.scrapeUrl(url, {
        formats: [
          {
            type: 'json',
            prompt: `Extract all product listings from the Tokopedia search result.
            Return:
            - title
            - price (number only, remove Rp and dots)
            - productUrl
            Only extract products that actually appear on the page.
            Do not generate or infer products.
            Do not create fake URLs.`,
            schema: {
              type: 'object',
              properties: {
                listings: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      price: { type: 'number' },
                      productUrl: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        ],
      });
      //   console.log('FIRECRAWL RESULT:', JSON.stringify(result, null, 2));
      const listings =
        (result as any)?.json?.listings ??
        (result as any)?.data?.json?.listings ??
        [];

      return listings.map((item: any) => ({
        title: String(item.title),
        price: Number(item.price),
        url: String(item.url),
        platform: 'tokopedia',
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Tokopedia failed: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Tokopedia failed: ${String(error)}`);
      }

      return [];
    }
  }
}
