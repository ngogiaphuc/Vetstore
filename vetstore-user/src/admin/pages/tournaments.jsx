import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Plus, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageHeader, StatusBadge, tournamentStatusMeta } from '@/components/shared';
import { findSport, findUser, findVenue, formatCompactVND, tournaments } from '@/services/mock-data';
import { cn } from '@/services/utils';
const order = { ongoing: 0, registration: 1, draft: 2, finished: 3 };
export default function TournamentsPage() {
    const sorted = tournaments.slice().sort((a, b) => order[a.status] - order[b.status]);
    return (<>
      <PageHeader title="Giải đấu" description="Bảng tournaments · tournament_teams · tournament_rounds · matches">
        <Button>
          <Plus className="size-4"/> Tạo giải đấu
        </Button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Danh sách giải đấu">
        {sorted.map((t) => {
            const meta = tournamentStatusMeta[t.status];
            const fill = Math.round((t.registeredTeams / t.maxTeams) * 100);
            return (<Card key={t.id} className={cn(t.status === 'ongoing' && 'border-primary/40 ring-1 ring-primary/20')}>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-lg', t.status === 'ongoing' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground')}>
                      <Trophy className="size-5"/>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <Link to={`/admin/tournaments/${t.id}`} className="font-semibold leading-tight text-balance hover:underline">
                        {t.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {findSport(t.sportId)?.name} · {t.format} · {findVenue(t.venueId)?.name}
                      </span>
                    </div>
                  </div>
                  <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Thời gian</span>
                    <span className="flex items-center gap-1 font-mono text-xs font-medium">
                      <CalendarDays className="size-3.5 text-muted-foreground"/>
                      {t.startDate.slice(5).split('-').reverse().join('/')} – {t.endDate.slice(5).split('-').reverse().join('/')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Lệ phí</span>
                    <span className="font-mono font-medium">{formatCompactVND(t.entryFee)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Giải thưởng</span>
                    <span className="font-mono font-semibold text-primary">{formatCompactVND(t.prizePool)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="size-3.5"/> Đội đăng ký
                    </span>
                    <span className="font-mono font-medium">
                      {t.registeredTeams}/{t.maxTeams}
                    </span>
                  </div>
                  <Progress value={fill}/>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    BTC: <span className="font-medium text-foreground">{findUser(t.organizerId)?.fullName}</span>
                  </span>
                  <Button variant="ghost" size="sm" nativeButton={false} render={<Link to={`/admin/tournaments/${t.id}`}/>}>
                    Chi tiết <ArrowRight className="size-4"/>
                  </Button>
                </div>
              </CardContent>
            </Card>);
        })}
      </section>
    </>);
}
