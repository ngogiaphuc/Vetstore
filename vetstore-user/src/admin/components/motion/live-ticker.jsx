import { Radio, Trophy, Ticket, Star } from 'lucide-react';
import { bookings, findCourt, findTeam, findUser, findVenue, formatVND, matches, reviews } from '@/services/mock-data';
import { cn } from '@/services/utils';
export function LiveTicker() {
    const items = [];
    matches
        .filter((m) => m.status === 'live')
        .forEach((m) => items.push({
        tone: 'live',
        icon: <Radio className="size-3 blink"/>,
        text: (<>
            <span className="font-semibold">LIVE</span> {findTeam(m.homeTeamId)?.shortName}{' '}
            <span className="font-mono font-bold">
              {m.homeScore}–{m.awayScore}
            </span>{' '}
            {findTeam(m.awayTeamId)?.shortName} · {findCourt(m.courtId)?.name}
          </>),
    }));
    matches
        .filter((m) => m.status === 'finished')
        .slice(0, 4)
        .forEach((m) => items.push({
        tone: 'gold',
        icon: <Trophy className="size-3"/>,
        text: (<>
            {findTeam(m.homeTeamId)?.shortName}{' '}
            <span className="font-mono font-semibold">
              {m.homeScore}–{m.awayScore}
            </span>{' '}
            {findTeam(m.awayTeamId)?.shortName} · Kết thúc
          </>),
    }));
    bookings
        .slice(0, 4)
        .forEach((b) => {
        const c = findCourt(b.courtId);
        items.push({
            icon: <Ticket className="size-3"/>,
            text: (<>
            {findUser(b.userId)?.fullName} đặt {c?.name} · {c ? findVenue(c.venueId)?.name : ''} ·{' '}
            <span className="font-mono">{formatVND(b.total - b.discount)}</span>
          </>),
        });
    });
    reviews.slice(0, 2).forEach((r) => items.push({
        icon: <Star className="size-3 fill-current"/>,
        text: (<>
          {findUser(r.userId)?.fullName} đánh giá {findVenue(r.venueId)?.name} <span className="font-mono">{r.rating}/5</span>
        </>),
    }));
    const row = (keyPrefix, ariaHidden = false) => (<ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={ariaHidden}>
      {items.map((it, i) => (<li key={`${keyPrefix}-${i}`} className={cn('flex items-center gap-2 whitespace-nowrap text-xs', it.tone === 'live' && 'text-destructive', it.tone === 'gold' && 'text-warning-foreground dark:text-warning', !it.tone && 'text-muted-foreground')}>
          {it.icon}
          <span className={it.tone ? 'text-foreground' : undefined}>{it.text}</span>
        </li>))}
    </ul>);
    return (<div className="reveal relative flex h-9 items-center overflow-hidden rounded-lg border bg-card" style={{ '--i': 0 }}>
      <div className="relative z-10 flex h-full shrink-0 items-center gap-1.5 border-r bg-primary px-3 font-mono text-[11px] font-bold tracking-wider text-primary-foreground">
        <span className="size-1.5 rounded-full bg-primary-foreground blink"/>
        TRỰC TIẾP
      </div>
      <div className="flex-1 overflow-hidden pl-4">
        <div className="marquee-track flex w-max" style={{ '--speed': `${items.length * 4}s` }}>
          {row('a')}
          {row('b', true)}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent"/>
    </div>);
}
