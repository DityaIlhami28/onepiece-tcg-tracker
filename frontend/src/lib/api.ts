import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
})

export const searchCards = async (q: string) => {
  const { data } = await api.get('/cards/search', { params: { q } })
  return data
}

export const getCard = async (id: number) => {
  const { data } = await api.get(`/cards/${id}`)
  return data
}

export const getLatestPrices = async (cardId: number) => {
  const { data } = await api.get(`/prices/${cardId}/latest`)
  return data
}

export const getPriceHistory = async (cardId: number, days = 30) => {
  const { data } = await api.get(`/prices/${cardId}/history`, {
    params: { days },
  })
  return data
}

export const triggerScrape = async (cardId: number) => {
  const { data } = await api.post(`/cards/${cardId}/scrape`)
  return data
}