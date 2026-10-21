import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Pencil, Share2, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge, tournamentStatusMeta } from '@/components/shared';
import { Bracket } from '@/admin/components/tournaments/bracket';
import { findCourt, findSport, findTeam, findUser, findVenue, formatVND, matches, tournamentRounds, tournamentTeams, tournaments } from '@/services/mock-data';

export default function TournamentDetailPage() {
    const { id } = useParams();
    const t = tournaments.find((x) => x.id === Number(id));
    if (!t) return <Navigate to="/tournaments" replace />;

    const meta = tournamentStatusMeta[t.status];
    const teamsIn = tournamentTeams.filter((tt) => tt.tournamentId === t.id);
    const tMatches = matches.filter((m) => m.tournamentId === t.id);
    const hasBracket = tournamentRounds.some((r) => r.tournamentId === t.id);

    return (<>
      <div className="flex flex-col gap-4">
        <Link to="/tournaments" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4"/> Tất cả giải đấu
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Trophy className="size-7"/>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-balance">{t.name}</h2>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-4"/>
                  <span className="font-mono">
                    {t.startDate.split('-').reverse().join('/')} – {t.endDate.split('-').reverse().join('/')}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4"/> {findVenue(t.venueId)?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-4"/> {t.registeredTeams}/{t.maxTeams} đội · {findSport(t.sportId)?.name} · {t.format}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-card">
              <Share2 className="size-4"/> Chia sẻ
            </Button>
            <Button variant="outline" className="bg-card">
              <Pencil className="size-4"/> Chỉnh sửa
            </Button>
            {t.status === 'ongoing' && <Button>Cập nhật tỷ số</Button>}
            {t.status === 'registration' && <Button>Duyệt đội đăng ký</Button>}
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Tổng giải thưởng</span>
            <span className="font-mono text-2xl font-semibold text-primary">{formatVND(t.prizePool)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Lệ phí / đội</span>
            <span className="font-mono text-2xl font-semibold">{formatVND(t.entryFee)}</span>
            <span className="text-xs text-muted-foreground">
              Đã thu {teamsIn.filter((x) => x.paid).length}/{teamsIn.length} đội
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Trận đấu</span>
            <span className="font-mono text-2xl font-semibold">
              {tMatches.filter((m) => m.status === 'finished').length}
              <span className="text-base text-muted-foreground">/{tMatches.length}</span>
            </span>
            <span className="text-xs text-muted-foreground">Ban tổ chức: {findUser(t.organizerId)?.fullName}</span>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue={hasBracket ? 'bracket' : 'teams'} className="gap-4">
        <TabsList>
          <TabsTrigger value="bracket">Sơ đồ thi đấu</TabsTrigger>
          <TabsTrigger value="matches">Lịch thi đấu</TabsTrigger>
          <TabsTrigger value="teams">Đội tham dự</TabsTrigger>
        </TabsList>

        <TabsContent value="bracket">
          <Card>
            <CardHeader>
              <CardTitle>Sơ đồ loại trực tiếp</CardTitle>
              <CardDescription>Bảng tournament_rounds → matches · đội thắng tô xanh, trận đang đấu viền đỏ</CardDescription>
            </CardHeader>
            <CardContent>
              {hasBracket ? (<Bracket tournamentId={t.id}/>) : (<p className="py-8 text-center text-sm text-muted-foreground">Sơ đồ sẽ được tạo sau khi khóa danh sách đội.</p>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Vòng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Sân</TableHead>
                    <TableHead className="text-right">Đội nhà</TableHead>
                    <TableHead className="text-center">Tỷ số</TableHead>
                    <TableHead>Đội khách</TableHead>
                    <TableHead className="pr-4 text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tMatches.length === 0 && (<TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        Chưa có lịch thi đấu.
                      </TableCell>
                    </TableRow>)}
                  {tMatches.map((m) => (<TableRow key={m.id}>
                      <TableCell className="pl-4 font-medium">{tournamentRounds.find((r) => r.id === m.roundId)?.name}</TableCell>
                      <TableCell className="font-mono text-xs">{m.scheduledAt}</TableCell>
                      <TableCell>{findCourt(m.courtId)?.name}</TableCell>
                      <TableCell className="text-right font-medium">{findTeam(m.homeTeamId)?.name ?? <span className="italic text-muted-foreground">Chờ xác định</span>}</TableCell>
                      <TableCell className="text-center font-mono text-base font-semibold">
                        {m.homeScore ?? '–'} : {m.awayScore ?? '–'}
                      </TableCell>
                      <TableCell className="font-medium">{findTeam(m.awayTeamId)?.name ?? <span className="italic text-muted-foreground">Chờ xác định</span>}</TableCell>
                      <TableCell className="pr-4 text-right">
                        {m.status === 'live' && <StatusBadge tone="destructive">Đang đấu</StatusBadge>}
                        {m.status === 'finished' && <StatusBadge tone="neutral">Kết thúc</StatusBadge>}
                        {m.status === 'scheduled' && <StatusBadge tone="info">Sắp diễn ra</StatusBadge>}
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4 w-16">Hạt giống</TableHead>
                    <TableHead>Đội</TableHead>
                    <TableHead>Đội trưởng</TableHead>
                    <TableHead className="text-right">Thành viên</TableHead>
                    <TableHead>Lệ phí</TableHead>
                    <TableHead className="pr-4 text-right">Duyệt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamsIn.length === 0 && (<TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        Chưa có đội đăng ký.
                      </TableCell>
                    </TableRow>)}
                  {teamsIn.map((tt) => {
                    const team = findTeam(tt.teamId);
                    return (<TableRow key={tt.teamId}>
                        <TableCell className="pl-4 font-mono">#{tt.seed}</TableCell>
                        <TableCell>
                          <Link to="/admin/teams" className="flex items-center gap-2 font-medium hover:underline">
                            <span className="flex size-7 items-center justify-center rounded-md bg-accent font-mono text-[10px] font-bold text-accent-foreground">{team?.shortName}</span>
                            {team?.name}
                          </Link>
                        </TableCell>
                        <TableCell>{findUser(team?.captainId ?? 0)?.fullName}</TableCell>
                        <TableCell className="text-right font-mono">{team?.memberCount}</TableCell>
                        <TableCell>
                          {tt.paid ? <StatusBadge tone="success">Đã nộp</StatusBadge> : <StatusBadge tone="warning">Chưa nộp</StatusBadge>}
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          <StatusBadge tone="info" dot={false}>
                            Đã duyệt
                          </StatusBadge>
                        </TableCell>
                      </TableRow>);
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>);
}
