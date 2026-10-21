import { Radio } from 'lucide-react';
import { findCourt, findTeam, matches, tournamentRounds } from '@/services/mock-data';
import { cn } from '@/services/utils';
export function Bracket({ tournamentId }) {
    const rounds = tournamentRounds.filter((r) => r.tournamentId === tournamentId).sort((a, b) => a.order - b.order);
    return (<div className="overflow-x-auto pb-2">
      <div className="flex min-w-[840px] items-stretch gap-8">
        {rounds.map((round, ri) => {
            const roundMatches = matches.filter((m) => m.roundId === round.id);
            return (<div key={round.id} className="flex flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold">{round.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {roundMatches.filter((m) => m.status === 'finished').length}/{roundMatches.length} xong
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-around gap-4">
                {roundMatches.map((m) => (<MatchCard key={m.id} match={m} isFinal={ri === rounds.length - 1}/>))}
              </div>
            </div>);
        })}
      </div>
    </div>);
}
function MatchCard({ match, isFinal }) {
    const home = findTeam(match.homeTeamId);
    const away = findTeam(match.awayTeamId);
    const live = match.status === 'live';
    const finished = match.status === 'finished';
    const homeWin = finished && (match.homeScore ?? 0) > (match.awayScore ?? 0);
    const awayWin = finished && (match.awayScore ?? 0) > (match.homeScore ?? 0);
    return (<div className={cn('overflow-hidden rounded-lg border bg-card text-sm', live && 'border-destructive/50 ring-1 ring-destructive/20', isFinal && 'border-warning ring-1 ring-warning/40')}>
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5 text-xs">
        <span className="font-mono text-muted-foreground">
          {match.scheduledAt.slice(8, 10)}/{match.scheduledAt.slice(5, 7)} · {match.scheduledAt.slice(11)} · {findCourt(match.courtId)?.name}
        </span>
        {live ? (<span className="flex items-center gap-1 font-mono font-semibold text-destructive">
            <Radio className="size-3"/> LIVE
          </span>) : finished ? (<span className="text-muted-foreground">Kết thúc</span>) : (<span className="text-muted-foreground">Sắp diễn ra</span>)}
      </div>
      <TeamRow name={home?.name} short={home?.shortName} score={match.homeScore} winner={homeWin} loser={awayWin}/>
      <TeamRow name={away?.name} short={away?.shortName} score={match.awayScore} winner={awayWin} loser={homeWin} className="border-t"/>
    </div>);
}
function TeamRow({ name, short, score, winner, loser, className, }) {
    return (<div className={cn('flex items-center gap-2 px-3 py-2', winner && 'bg-success/10', loser && 'text-muted-foreground', className)}>
      <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold', name ? 'bg-accent text-accent-foreground' : 'border border-dashed text-muted-foreground')}>
        {short ?? '?'}
      </span>
      <span className={cn('flex-1 truncate', winner && 'font-semibold', !name && 'italic text-muted-foreground')}>{name ?? 'Chờ xác định'}</span>
      <span className={cn('w-6 text-right font-mono text-base', winner && 'font-bold text-success')}>{score ?? '–'}</span>
    </div>);
}
