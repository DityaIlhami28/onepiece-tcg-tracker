'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { searchCards } from '@/lib/api'
import { formatIDR, rarityConfig } from '@/lib/utils'
import { Card } from '@/types'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCards(query)
        setResults(data)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = useCallback(
    (card: Card) => {
      router.push(`/cards/${card.id}`)
      setQuery('')
      setResults([])
      setOpen(false)
    },
    [router]
  )

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      {/* Input */}
      <div className="relative">
        {loading ? (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or set code — Luffy, OP01-060, Zoro..."
          className="pl-11 h-13 text-base bg-secondary border-border
                     placeholder:text-muted-foreground rounded-xl
                     focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+6px)] w-full z-50
                        rounded-xl border border-border bg-card
                        shadow-2xl shadow-black/40 overflow-hidden">

          {results.length > 0 ? (
            results.map((card, i) => {
              const rarity = card.rarity ? rarityConfig[card.rarity] : null
              const lowestPrice = card.prices?.[0]?.price

              return (
                <button
                  key={card.id}
                  onClick={() => handleSelect(card)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left
                              transition-colors
                              ${i !== results.length - 1 ? 'border-b border-border' : ''}
                              ${activeIndex === i ? 'bg-secondary' : 'hover:bg-secondary/60'}`}
                >
                  {/* Card image */}
                  <div className="h-11 w-8 rounded flex-shrink-0 overflow-hidden bg-muted">
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        width={32}
                        height={44}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  {/* Card info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {card.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {card.setCode}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {rarity && (
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${rarity.color} ${rarity.border}`}
                      >
                        {card.rarity}
                      </Badge>
                    )}
                    {lowestPrice && (
                      <span className="text-xs font-mono text-primary font-semibold">
                        {formatIDR(lowestPrice)}
                      </span>
                    )}
                  </div>
                </button>
              )
            })
          ) : (
            <div className="px-4 py-5 text-sm text-muted-foreground text-center">
              No cards found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}