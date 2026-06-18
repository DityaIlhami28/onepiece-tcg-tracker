import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor(diff / 60000)

  if (hours >= 24) return `${Math.floor(hours / 24)}d ago`
  if (hours >= 1) return `${hours}h ago`
  if (minutes >= 1) return `${minutes}m ago`
  return 'just now'
}

export const rarityConfig: Record<string, { label: string; color: string; border: string }> = {
  L:  { label: 'Leader',   color: 'text-yellow-400', border: 'border-yellow-400/40' },
  SR: { label: 'Super Rare', color: 'text-purple-400', border: 'border-purple-400/40' },
  R:  { label: 'Rare',     color: 'text-blue-400',   border: 'border-blue-400/40' },
  UC: { label: 'Uncommon', color: 'text-slate-400',  border: 'border-slate-400/40' },
  C:  { label: 'Common',   color: 'text-slate-500',  border: 'border-slate-500/40' },
  SP: { label: 'Special',  color: 'text-pink-400',   border: 'border-pink-400/40' },
}