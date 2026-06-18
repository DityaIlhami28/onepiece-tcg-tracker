import { ExternalLink } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatIDR, timeAgo } from '@/lib/utils'
import { Price } from '@/types'

interface Props {
  platform: 'tokopedia'
  price?: Price
}

const platformConfig = {
  tokopedia: {
    label: 'Tokopedia',
    color: 'text-emerald-400',
    border: 'border-emerald-400/20',
    bg: 'bg-emerald-400/5',
    badgeColor: 'text-emerald-400 border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  shopee: {
    label: 'Shopee',
    color: 'text-orange-400',
    border: 'border-orange-400/20',
    bg: 'bg-orange-400/5',
    badgeColor: 'text-orange-400 border-orange-400/30',
    dot: 'bg-orange-400',
  },
}

export function PriceCard({ platform, price }: Props) {
  const c = platformConfig[platform]

  return (
    <Card className={`flex-1 border ${c.border} ${c.bg}`}>
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${price ? c.dot : 'bg-muted-foreground'}`} />
            <span className={`text-sm font-semibold ${c.color}`}>
              {c.label}
            </span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${price ? c.badgeColor : 'text-muted-foreground border-muted-foreground/30'}`}
          >
            {price ? timeAgo(price.scrapedAt) : 'No data'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {price ? (
          <div className="space-y-2">
            <p className={`text-2xl font-mono font-bold tracking-tight ${c.color}`}>
              {formatIDR(price.price)}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {price.title}
            </p>
            <a
              href={price.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 text-xs font-medium
                          ${c.color} hover:underline underline-offset-2 mt-1`}
            >
              View listing
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Hit &ldquo;Refresh&rdquo; to fetch prices.
          </p>
        )}
      </CardContent>
    </Card>
  )
}