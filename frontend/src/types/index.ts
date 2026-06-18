export interface Card {
  id: number
  name: string
  setCode?: string
  imageUrl?: string
  rarity?: string
  cardType?: string
  prices?: Price[]
}

export interface Price {
  id: number
  cardId: number
  platform: string
  price: number
  title: string
  url: string
  scrapedAt: string
}

export interface LatestPrices {
  tokopedia?: Price
  shopee?: Price
}

export interface CardsResponse {
  cards: Card[]
  total: number
  page: number
  pages: number
}