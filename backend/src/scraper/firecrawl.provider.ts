import { Provider } from '@nestjs/common';
import FirecrawlApp from '@mendable/firecrawl-js';

export const FIRECRAWL = 'FIRECRAWL';

export const FirecrawlProvider: Provider = {
  provide: FIRECRAWL,
  useFactory: () => {
    console.log(
      'FIRECRAWL_API_KEY:',
      process.env.FIRECRAWL_API_KEY,
    );
    return new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY
    });
  },
};