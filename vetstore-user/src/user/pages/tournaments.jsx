import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, Zap, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tournaments, tournamentBrackets, sports, teams } from '@/services/mock-data';
import { cn } from '@/services/utils';

export default function UserTournamentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState(id ? 'detail' : 'list'); // 'list' (21) | 'detail' (22) | 'register' (23) | 'bracket' (24)

  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedTeamId, setSelectedTeamId] = useState('1'); // Saigon Smash
  const [agreed, setAgreed] = useState(true);

  const tournament = tournaments.find((t) => t.id === Number(id || 1)) || tournaments[0];

  const filteredTournaments = tournaments.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedSport !== 'all') {
      const s = sports.find((sp) => sp.id === t.sportId);
      if (s?.code !== selectedSport) return false;
    }
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    return true;
  });

  const handleConfirmRegister = (e) => {
    e.preventDefault();
    alert('Đăng ký đội tham gia giải đấu thành công!');
    setView('bracket');
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header (Trang 21) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
              GIẢI ĐẤU
            </span>
            <h1 className="text-2xl font-black text-foreground sm:text-3xl">Sẵn sàng cho thử thách mới?</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tham gia các giải đấu phong trào, gặp gỡ cộng đồng và khẳng định bản thân.
            </p>
          </div>

          {view !== 'list' && (
            <Button variant="outline" size="sm" onClick={() => setView('list')} className="font-bold text-xs">
              ← Danh sách giải đấu
            </Button>
          )}
        </div>

        {/* TRANG 21: DANH SÁCH GIẢI ĐẤU (Matching Mockup 21) */}
        {view === 'list' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
              <div className="relative">
                <Input
                  placeholder="Tên giải đấu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-background text-xs pr-8"
                />
              </div>

              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="bg-background text-xs">
                  <SelectValue placeholder="Môn thể thao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  {sports.map((s) => (
                    <SelectItem key={s.id} value={s.code}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-background text-xs">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="registration">Đang nhận đăng ký</SelectItem>
                  <SelectItem value="ongoing">Sắp diễn ra</SelectItem>
                  <SelectItem value="finished">Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>

              <Button className="font-bold text-xs">Lọc giải đấu</Button>
            </div>

            {/* Tournament Cards Grid (Matching Mockup 21) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredTournaments.map((t) => (
                <Card key={t.id} className="rounded-2xl border-border shadow-sm overflow-hidden group">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={t.banner} alt={t.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className={cn(
                      'absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-md',
                      t.status === 'registration' ? 'bg-emerald-500' : t.status === 'ongoing' ? 'bg-amber-500' : 'bg-slate-500'
                    )}>
                      {t.statusLabel}
                    </span>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-foreground line-clamp-1">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">🏸 {t.sportName}</p>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                      <p className="flex items-center gap-1.5 font-mono">
                        📅 {t.dateRangeText}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary shrink-0" /> {t.venueName}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Users className="size-3.5" /> {t.registeredTeams} trên {t.maxTeams} đội
                      </p>
                      <p className="font-bold font-mono text-primary text-sm">
                        {t.entryFeeText}
                      </p>
                    </div>

                    <Button
                      className="w-full font-bold text-xs mt-2"
                      onClick={() => setView('detail')}
                    >
                      Xem chi tiết →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TRANG 22: CHI TIẾT GIẢI ĐẤU (Matching Mockup 22) */}
        {view === 'detail' && (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/tournaments" className="hover:text-foreground">Giải đấu</Link>
              <ChevronRight className="size-3" />
              <span className="font-semibold text-foreground">{tournament.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-foreground">{tournament.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">🏸 {tournament.sportName}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {tournament.statusLabel}
                  </span>
                </div>
              </div>

              <Button onClick={() => setView('register')} className="font-bold text-sm px-6 size-11 shadow-lg">
                🏆 Đăng ký đội
              </Button>
            </div>

            {/* Banner & Tournament Stats (Matching Mockup 22) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-border relative">
                  <img src={tournament.banner} alt={tournament.name} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute bottom-6 left-6 text-white space-y-1">
                    <p className="font-serif italic text-2xl">Play Together</p>
                    <p className="font-black text-lg text-amber-300">Go Further</p>
                  </div>
                </div>

                {/* Tabs: Tổng quan | Đội tham gia | Lịch thi đấu | Kết quả */}
                <div className="flex border-b border-border text-sm font-bold gap-6">
                  <button onClick={() => setView('detail')} className="pb-3 border-b-2 border-primary text-primary">
                    Giới thiệu giải đấu
                  </button>
                  <button onClick={() => setView('bracket')} className="pb-3 text-muted-foreground hover:text-foreground">
                    Vòng đấu, lịch & kết quả (Trang 24)
                  </button>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                  <p>{tournament.description}</p>
                  <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-2xl">
                    <div>
                      <span className="font-bold text-foreground block">Nội dung thi đấu</span>
                      <p>{tournament.format}</p>
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Địa điểm</span>
                      <p>{tournament.locationText}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stats Box (Matching Mockup 22) */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="rounded-2xl border-border shadow-sm p-6 space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Số đội tham gia</span>
                    <span className="text-2xl font-black text-foreground font-mono">{tournament.registeredTeams} / {tournament.maxTeams} đội</span>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-primary" style={{ width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` }} />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground block">Phí đăng ký</span>
                    <span className="text-2xl font-black text-primary font-mono">{tournament.entryFeeText}</span>
                  </div>

                  <Button onClick={() => setView('register')} className="w-full font-bold size-11 text-sm shadow-md mt-2">
                    Đăng ký đội
                  </Button>

                  <div className="space-y-2 text-xs border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <span>Thời gian diễn ra: <strong className="font-mono">{tournament.dateRangeText}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <Clock className="size-4 text-primary" /> */}
                      <span>Hạn đăng ký: <strong className="font-mono">{tournament.registrationDeadline}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span>Địa điểm: <strong>{tournament.venueName}</strong></span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TRANG 23: ĐĂNG KÝ THAM GIA GIẢI (Matching Mockup 23) */}
        {view === 'register' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                23. ĐĂNG KÝ THAM GIA GIẢI
              </span>
              <h2 className="text-2xl font-black text-foreground">Đưa đội của bạn vào cuộc chơi.</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Chọn đội của bạn để tham gia giải đấu và cùng chinh phục thử thách mới.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <Card className="rounded-2xl border-border shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="font-bold text-sm text-foreground">Chọn đội tham gia</h3>

                    <div className="space-y-3">
                      {teams.map((t) => (
                        <label
                          key={t.id}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer',
                            selectedTeamId === t.id.toString()
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-border hover:bg-muted'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="teamSelect"
                              checked={selectedTeamId === t.id.toString()}
                              onChange={() => setSelectedTeamId(t.id.toString())}
                              className="accent-primary"
                            />
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 font-bold text-primary text-xs">
                              {t.shortName}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{t.name}</p>
                              <p className="text-[10px] text-muted-foreground">🏸 {t.sportName} • {t.memberCount} thành viên</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <h4 className="font-bold text-xs text-foreground uppercase">Thành viên trong đội</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-muted font-semibold flex items-center justify-between">
                          <span>M. Minh Huy</span>
                          <span className="text-[10px] text-amber-600 font-bold">Đội trưởng</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted font-semibold flex items-center justify-between">
                          <span>H. Hoàng</span>
                          <span className="text-[10px] text-muted-foreground">Thành viên</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted font-semibold flex items-center justify-between">
                          <span>Đ. Đạt</span>
                          <span className="text-[10px] text-muted-foreground">Thành viên</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted font-semibold flex items-center justify-between">
                          <span>T. Tuấn</span>
                          <span className="text-[10px] text-muted-foreground">Thành viên</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="accent-primary rounded"
                        />
                        Tôi đã đọc và đồng ý với thể lệ giải đấu.
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Summary & Confirm Button (Matching Mockup 23) */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="rounded-2xl border-border shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-base text-foreground">Thông tin giải đấu</h3>

                  <div className="flex items-center gap-3">
                    <img src={tournament.banner} alt={tournament.name} className="size-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{tournament.name}</h4>
                      <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                        {tournament.statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-border pt-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">📅 Ngày bắt đầu</span>
                      <span className="font-bold">{tournament.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">💰 Phí đăng ký</span>
                      <span className="font-bold text-primary text-sm">{tournament.entryFeeText}</span>
                    </div>
                  </div>

                  <Button onClick={handleConfirmRegister} className="w-full font-bold size-11 text-sm shadow-md">
                    Xác nhận đăng ký
                  </Button>
                  <Button variant="outline" className="w-full text-xs font-bold" onClick={() => setView('detail')}>
                    Quay lại
                  </Button>

                  <p className="text-[10px] text-muted-foreground text-center">
                    ℹ️ Đội đã đăng ký không thể đăng ký lại.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TRANG 24: SƠ ĐỒ VÒNG ĐẤU & LỊCH THI ĐẤU (Matching Mockup 24) */}
        {view === 'bracket' && (
          <div className="space-y-8">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                24. VÒNG ĐẤU, LỊCH & KẾT QUẢ
              </span>
              <h2 className="text-3xl font-black text-foreground">{tournament.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Mỗi trận đấu là một câu chuyện và bạn là một phần trong đó.
              </p>
            </div>

            {/* Bracket Sơ đồ vòng đấu (Matching Mockup 24) */}
            <Card className="rounded-2xl border-border shadow-sm p-6 space-y-6">
              <h3 className="font-bold text-base text-foreground">Sơ đồ vòng đấu</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Bán kết */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase block">Bán kết</span>
                  
                  {/* Match 1 */}
                  <div className="p-3 rounded-xl border border-primary bg-primary/10 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-primary" /> Saigon Smash
                      </span>
                      <span className="font-mono text-primary">2</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Blue Wings</span>
                      <span className="font-mono">1</span>
                    </div>
                  </div>

                  {/* Match 2 */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>City Rackets</span>
                      <span className="font-mono">0</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>Phú Thọ Club</span>
                      <span className="font-mono text-primary">2</span>
                    </div>
                  </div>
                </div>

                {/* Chung kết */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase block">Chung kết</span>

                  <div className="p-4 rounded-2xl border-2 border-dashed border-primary bg-card space-y-3">
                    <div className="flex justify-between text-xs font-bold text-primary">
                      <span>Saigon Smash</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Chưa diễn ra</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>Phú Thọ Club</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Lịch thi đấu sắp tới Table (Matching Mockup 24) */}
            <Card className="rounded-2xl border-border shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-base text-foreground">Lịch thi đấu sắp tới</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground uppercase font-bold text-[10px] border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">Trận</th>
                      <th className="py-2.5 px-3">Sân</th>
                      <th className="py-2.5 px-3">Ngày</th>
                      <th className="py-2.5 px-3">Giờ</th>
                      <th className="py-2.5 px-3 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-3 font-bold text-foreground">Chung kết</td>
                      <td className="py-3 px-3">Sân cầu lông 02</td>
                      <td className="py-3 px-3 font-mono">28/09/2026</td>
                      <td className="py-3 px-3 font-mono">18:00 - 19:00</td>
                      <td className="py-3 px-3 text-right">
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                          Đã lên lịch
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-muted-foreground">
                ℹ️ Lịch có thể được ban tổ chức cập nhật.
              </p>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}