import { MapPin, Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/shared';
import { findSport, findUser, initials, teamMembers, teams } from '@/services/mock-data';
import { cn } from '@/services/utils';
export default function TeamsPage() {
    const ranked = teams
        .filter((t) => t.sportId === 1)
        .map((t) => ({ ...t, points: t.wins * 3 + t.draws, played: t.wins + t.losses + t.draws }))
        .sort((a, b) => b.points - a.points);
    const featured = teams[0];
    const members = teamMembers.filter((m) => m.teamId === featured.id);
    return (<>
      <PageHeader title="Đội thể thao" description="Bảng teams · team_members · thống kê từ matches">
        <Button>
          <Plus className="size-4"/> Tạo đội
        </Button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Danh sách đội">
        {teams.map((t) => {
            const played = t.wins + t.losses + t.draws;
            const rate = played ? Math.round((t.wins / played) * 100) : 0;
            return (<Card key={t.id} className={cn(t.id === featured.id && 'border-primary/40 ring-1 ring-primary/20')}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-xs font-bold text-primary-foreground">
                    {t.shortName}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold leading-tight">{t.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3"/> {t.district} · {findSport(t.sportId)?.name}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-md bg-muted/60 p-2 text-center">
                  <Stat label="Thắng" value={t.wins} className="text-success"/>
                  <Stat label="Hòa" value={t.draws}/>
                  <Stat label="Thua" value={t.losses} className="text-destructive"/>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.memberCount} thành viên</span>
                  <span className="font-mono">
                    Tỷ lệ thắng <span className="font-semibold text-foreground">{rate}%</span>
                  </span>
                </div>
              </CardContent>
            </Card>);
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Bảng xếp hạng bóng đá</CardTitle>
            <CardDescription>Tính theo toàn bộ trận đã đấu · 3 điểm/thắng, 1 điểm/hòa</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 pl-4">#</TableHead>
                  <TableHead>Đội</TableHead>
                  <TableHead className="text-right">Trận</TableHead>
                  <TableHead className="text-right">T</TableHead>
                  <TableHead className="text-right">H</TableHead>
                  <TableHead className="text-right">B</TableHead>
                  <TableHead className="pr-4 text-right">Điểm</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranked.map((t, i) => (<TableRow key={t.id}>
                    <TableCell className="pl-4 font-mono text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <span className={cn('flex size-6 items-center justify-center rounded font-mono text-[10px] font-bold', i < 3 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground')}>
                          {t.shortName}
                        </span>
                        {t.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">{t.played}</TableCell>
                    <TableCell className="text-right font-mono">{t.wins}</TableCell>
                    <TableCell className="text-right font-mono">{t.draws}</TableCell>
                    <TableCell className="text-right font-mono">{t.losses}</TableCell>
                    <TableCell className="pr-4 text-right font-mono font-bold">{t.points}</TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4 text-primary"/> {featured.name}
            </CardTitle>
            <CardDescription>Danh sách thành viên · bảng team_members</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {members.map((m) => {
            const u = findUser(m.userId);
            return (<div key={m.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="w-6 text-center font-mono text-sm font-bold text-muted-foreground">{m.number}</span>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-accent text-[10px] font-semibold text-accent-foreground">{initials(u?.fullName ?? '')}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm font-medium">{u?.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {m.position} · tham gia {m.joinedAt.split('-').reverse().join('/')}
                    </span>
                  </div>
                  <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', m.role === 'Đội trưởng' ? 'bg-warning text-warning-foreground' : 'bg-muted text-muted-foreground')}>
                    {m.role}
                  </span>
                </div>);
        })}
            <div className="pt-3 text-center text-xs text-muted-foreground">+ {featured.memberCount - members.length} thành viên khác</div>
          </CardContent>
        </Card>
      </section>
    </>);
}
function Stat({ label, value, className }) {
    return (<div className="flex flex-col">
      <span className={cn('font-mono text-lg font-bold leading-none', className)}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>);
}
